const { supabaseAdmin } = require('../../config/supabase');
const { sendResponse, sendError } = require('../utils/helpers');
const { STATUS_FLOW } = require('../utils/constants');
const Joi = require('joi');

const ROLE_STATUS_MAP = {
  labassistant: 'lab_pending',
  lab: 'lab_pending', // Compatibility for both naming styles
  hod: 'hod_pending',
  principal: 'principal_pending'
};

/**
 * Get applications pending in the current admin's stage
 */
const queue = async (req, res) => {
  try {
    const role = req.user.role;
    const pendingStatus = ROLE_STATUS_MAP[role];

    if (!pendingStatus) {
      return sendError(res, 403, 'Your role is not associated with an approval stage');
    }

    // Validation
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      branch: Joi.string().optional()
    });

    const { error: valError, value: queryParams } = schema.validate(req.query);
    if (valError) return sendError(res, 400, valError.details[0].message);

    const { page, limit, branch } = queryParams;
    const offset = (page - 1) * limit;

    // Build Query
    let dbQuery = supabaseAdmin
      .from('applications')
      .select('*, profiles(uid, name, branch, email)', { count: 'exact' })
      .eq('status', pendingStatus)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: applications, count, error } = await dbQuery;

    if (error) throw error;

    // Filter by branch in JS if provided (Supabase doesn't easily filter joined columns in the same call)
    let filteredApps = applications;
    if (branch) {
      filteredApps = applications.filter(app => app.profiles && app.profiles.branch === branch);
    }

    return sendResponse(res, 200, {
      applications: filteredApps,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      },
      pendingStatus
    }, 'Queue fetched successfully');

  } catch (error) {
    console.error('Queue error:', error);
    return sendError(res, 500, 'Internal server error while fetching queue');
  }
};

/**
 * Approve an application to the next stage
 */
const approve = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const role = req.user.role;
    const pendingStatus = ROLE_STATUS_MAP[role];

    if (!pendingStatus) {
      return sendError(res, 403, 'Your role is not authorized to approve applications');
    }

    // 1. Fetch application to verify status
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();

    if (!application) return sendError(res, 404, 'Application not found');

    if (application.status !== pendingStatus) {
      return sendError(res, 400, `This application is not in your review stage. Current status: ${application.status}`);
    }

    // 2. Determine next status
    const nextStatus = STATUS_FLOW[pendingStatus];
    if (!nextStatus) return sendError(res, 500, 'Invalid status flow configuration');

    // 3. Update status
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: nextStatus })
      .eq('id', applicationId)
      .select('*, profiles(uid, name, branch, email)')
      .single();

    if (updateError) throw updateError;

    return sendResponse(res, 200, {
      application: updated,
      previousStatus: pendingStatus,
      newStatus: nextStatus
    }, `Application moved to ${nextStatus}`);

  } catch (error) {
    console.error('Approve error:', error);
    return sendError(res, 500, 'Internal server error during approval');
  }
};

/**
 * Reject an application
 */
const reject = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;
    const role = req.user.role;
    const pendingStatus = ROLE_STATUS_MAP[role];

    if (!pendingStatus) {
      return sendError(res, 403, 'Your role is not authorized to reject applications');
    }

    // 1. Fetch and verify
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();

    if (!application) return sendError(res, 404, 'Application not found');

    if (application.status !== pendingStatus) {
      return sendError(res, 400, `This application is not in your review stage. Current status: ${application.status}`);
    }

    // 2. Update to rejected
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)
      .select('*, profiles(uid, name, branch, email)')
      .single();

    if (updateError) throw updateError;

    return sendResponse(res, 200, {
      application: updated,
      reason: reason || null
    }, 'Application rejected');

  } catch (error) {
    console.error('Reject error:', error);
    return sendError(res, 500, 'Internal server error during rejection');
  }
};

/**
 * Get aggregate stats for admin dashboard
 */
const stats = async (req, res) => {
  try {
    const role = req.user.role;
    const pendingStatus = ROLE_STATUS_MAP[role];

    const statuses = ['lab_pending', 'hod_pending', 'principal_pending', 'approved', 'rejected'];
    
    const countPromises = statuses.map(s => 
      supabaseAdmin
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', s)
    );

    const results = await Promise.all(countPromises);
    
    const statsObj = {};
    let total = 0;
    statuses.forEach((s, i) => {
      const count = results[i].count || 0;
      statsObj[s] = count;
      total += count;
    });
    statsObj.total = total;

    return sendResponse(res, 200, {
      stats: statsObj,
      myQueueCount: pendingStatus ? (statsObj[pendingStatus] || 0) : 0,
      role
    }, 'Stats fetched successfully');

  } catch (error) {
    console.error('Stats error:', error);
    return sendError(res, 500, 'Internal server error while fetching stats');
  }
};

/**
 * Search applications with filters
 */
const search = async (req, res) => {
  try {
    const schema = Joi.object({
      uid: Joi.string().optional(),
      name: Joi.string().optional(),
      branch: Joi.string().optional(),
      status: Joi.string().optional()
    }).min(1);

    const { error: valError, value: filters } = schema.validate(req.query);
    if (valError) return sendError(res, 400, 'At least one search parameter is required');

    const { uid, name, branch, status } = filters;

    let query = supabaseAdmin
      .from('applications')
      .select('*, profiles(uid, name, branch, email)');

    if (uid) query = query.eq('student_uid', uid);
    if (status) query = query.eq('status', status);

    const { data: applications, error } = await query.order('created_at', { ascending: false }).limit(50);

    if (error) throw error;

    // Filter name/branch in JS
    let filtered = applications;
    if (name) {
      filtered = filtered.filter(app => app.profiles && app.profiles.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (branch) {
      filtered = filtered.filter(app => app.profiles && app.profiles.branch === branch);
    }

    return sendResponse(res, 200, {
      applications: filtered,
      total: filtered.length
    }, 'Search results fetched');

  } catch (error) {
    console.error('Search error:', error);
    return sendError(res, 500, 'Internal server error during search');
  }
};

module.exports = {
  queue,
  approve,
  reject,
  stats,
  search
};
