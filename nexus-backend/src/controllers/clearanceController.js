const { supabaseAdmin } = require('../../config/supabase');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * Get the application status of the currently logged-in student
 */
const getMyApplicationStatus = async (req, res) => {
  try {
    const uid = req.user.uid;

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, profiles(name, branch, email)')
      .eq('student_uid', uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return sendError(res, 404, 'Application not found for this user');
      }
      return sendError(res, 500, 'Database error while fetching application status');
    }

    return sendResponse(res, 200, data, 'Application status fetched successfully');

  } catch (error) {
    console.error('Fetch application error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * Get all applications (Admin/Staff only)
 */
const getAllApplications = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, profiles(name, branch, email)')
      .order('created_at', { ascending: false });

    if (error) {
      return sendError(res, 500, 'Database error while fetching applications');
    }

    return sendResponse(res, 200, data, 'Applications fetched successfully');

  } catch (error) {
    console.error('Fetch all applications error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * Update the status of an application (Admin/Staff only)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status based on schema enum check
    const validStatuses = ['lab_pending', 'hod_pending', 'principal_pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 400, 'Invalid status provided');
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return sendError(res, 500, 'Database error while updating application status');
    }

    return sendResponse(res, 200, data, `Application status updated to ${status}`);

  } catch (error) {
    console.error('Update application error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

module.exports = {
  getMyApplicationStatus,
  getAllApplications,
  updateApplicationStatus
};
