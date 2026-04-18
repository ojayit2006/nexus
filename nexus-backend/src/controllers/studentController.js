const { supabaseAdmin } = require('../../config/supabase');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * Get the authenticated student's profile
 */
const getMyProfile = async (req, res) => {
  try {
    const uid = req.user.uid; // Extract UID from JWT

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // 0 rows returned
        return sendError(res, 404, 'Profile not found');
      }
      return sendError(res, 500, 'Database error while fetching profile');
    }

    return sendResponse(res, 200, data, 'Profile fetched successfully');

  } catch (error) {
    console.error('Fetch profile error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * Get all profiles (Admin/Staff only)
 */
const getAllProfiles = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (error) {
      return sendError(res, 500, 'Database error while fetching profiles');
    }

    return sendResponse(res, 200, data, 'Profiles fetched successfully');

  } catch (error) {
    console.error('Fetch all profiles error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

module.exports = {
  getMyProfile,
  getAllProfiles
};
