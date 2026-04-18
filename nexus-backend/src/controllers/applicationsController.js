const { supabaseAdmin } = require('../../config/supabase');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * Submit a new clearance application
 */
const submit = async (req, res) => {
  try {
    const studentUid = req.user.uid;

    // 1. Check for existing active application
    const { data: activeApp, error: activeError } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('student_uid', studentUid)
      .in('status', ['lab_pending', 'hod_pending', 'principal_pending'])
      .maybeSingle();

    if (activeApp) {
      return sendError(res, 409, 'You already have an active clearance application', { existingApplication: activeApp });
    }

    // 2. Check if already approved
    const { data: approvedApp, error: approvedError } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('student_uid', studentUid)
      .eq('status', 'approved')
      .maybeSingle();

    if (approvedApp) {
      return sendError(res, 409, 'Your clearance has already been approved');
    }

    // 3. Insert new application
    const { data: application, error: insertError } = await supabaseAdmin
      .from('applications')
      .insert([{ student_uid: studentUid, status: 'lab_pending' }])
      .select()
      .single();

    if (insertError) throw insertError;

    return sendResponse(res, 201, { application }, 'Application submitted. Awaiting lab clearance.');

  } catch (error) {
    console.error('Submit application error:', error);
    return sendError(res, 500, 'Internal server error during submission');
  }
};

/**
 * Get the latest status for the logged-in student
 */
const myStatus = async (req, res) => {
  try {
    const studentUid = req.user.uid;

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('student_uid', studentUid)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!application) {
      return sendResponse(res, 200, { application: null }, 'No application found. Submit one to begin clearance.');
    }

    return sendResponse(res, 200, {
      application,
      statusLabel: getStatusLabel(application.status),
      nextStep: getNextStep(application.status)
    }, 'Status fetched successfully');

  } catch (error) {
    console.error('Fetch status error:', error);
    return sendError(res, 500, 'Internal server error while fetching status');
  }
};

/**
 * Get all past applications for the student
 */
const history = async (req, res) => {
  try {
    const studentUid = req.user.uid;

    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('student_uid', studentUid)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sendResponse(res, 200, { applications, total: applications.length }, 'History fetched successfully');

  } catch (error) {
    console.error('Fetch history error:', error);
    return sendError(res, 500, 'Internal server error while fetching history');
  }
};

// --- Helper Functions ---

const getStatusLabel = (status) => {
  const labels = {
    lab_pending: 'Awaiting Lab Clearance',
    hod_pending: 'Awaiting HOD Approval',
    principal_pending: 'Awaiting Principal Approval',
    approved: 'Fully Approved',
    rejected: 'Rejected'
  };
  return labels[status] || 'Unknown Status';
};

const getNextStep = (status) => {
  const steps = {
    lab_pending: 'Your application is in the lab review queue',
    hod_pending: 'Lab cleared. Awaiting HOD review.',
    principal_pending: 'HOD approved. Awaiting Principal sign-off.',
    approved: 'Clearance complete. No further action needed.',
    rejected: 'Application rejected. Contact your department.'
  };
  return steps[status] || 'Contact support for more information.';
};

module.exports = {
  submit,
  myStatus,
  history
};
