import { supabaseAdmin } from '../../config/supabase.js';
import logger from '../utils/logger.js';

/**
 * GET /api/admin/pending (verifyToken + requireRole(['lab', 'hod', 'principal']))
 */
export const getPendingApplications = async (req, res) => {
  try {
    const adminRole = req.user.role;
    let targetStatus;

    if (adminRole === 'lab') targetStatus = 'lab_pending';
    else if (adminRole === 'hod') targetStatus = 'hod_pending';
    else if (adminRole === 'principal') targetStatus = 'principal_pending';
    else return res.status(403).json({ error: 'Unauthorized role' });

    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*, profiles(name, branch, email)')
      .eq('status', targetStatus)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    logger.error(`Admin getPending error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/applications/:id/approve (verifyToken + requireRole(['lab', 'hod', 'principal']))
 */
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const adminRole = req.user.role;

    // 1. Fetch current application
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 2. Validate role vs status
    const isValidStage = (
      (adminRole === 'lab' && application.status === 'lab_pending') ||
      (adminRole === 'hod' && application.status === 'hod_pending') ||
      (adminRole === 'principal' && application.status === 'principal_pending')
    );

    if (!isValidStage) {
      return res.status(403).json({ error: 'You cannot approve an application at this stage' });
    }

    // 3. Determine next status
    let nextStatus;
    if (adminRole === 'lab') nextStatus = 'hod_pending';
    else if (adminRole === 'hod') nextStatus = 'principal_pending';
    else if (adminRole === 'principal') nextStatus = 'approved';

    // 4. Update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: nextStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    logger.info(`Application ${id} approved by ${req.user.uid} (${adminRole}) -> ${nextStatus}`);

    return res.status(200).json({
      success: true,
      message: `Application successfully moved to ${nextStatus}`,
      application: updated
    });

  } catch (error) {
    logger.error(`Admin approve error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/applications/:id/reject (verifyToken + requireRole(['lab', 'hod', 'principal']))
 */
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const adminRole = req.user.role;

    // 1. Fetch current application
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 2. Update to rejected
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    logger.info(`Application ${id} REJECTED by ${req.user.uid} (${adminRole})`);

    return res.status(200).json({
      success: true,
      message: 'Application rejected',
      application: updated
    });

  } catch (error) {
    logger.error(`Admin reject error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/admin/stats (verifyToken + requireRole(['lab', 'hod', 'principal']))
 */
export const getStats = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      lab_pending: data.filter(a => a.status === 'lab_pending').length,
      hod_pending: data.filter(a => a.status === 'hod_pending').length,
      principal_pending: data.filter(a => a.status === 'principal_pending').length,
      approved: data.filter(a => a.status === 'approved').length,
      rejected: data.filter(a => a.status === 'rejected').length
    };

    return res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
