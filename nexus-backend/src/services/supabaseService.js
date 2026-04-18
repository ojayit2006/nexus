const { supabaseAdmin } = require('../../config/supabase');

/**
 * Fetch profile by UID
 */
async function getProfileByUid(uid) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('uid', uid)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

/**
 * Fetch applications by status with pagination
 */
async function getApplicationsByStatus(status, limit = 20, offset = 0) {
  const { data, count, error } = await supabaseAdmin
    .from('applications')
    .select('*, profiles(uid, name, branch, email)', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return { data, count };
}

/**
 * Get the latest application for a student
 */
async function getStudentApplication(studentUid) {
  const { data, error } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('student_uid', studentUid)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

/**
 * Update the status of a specific application
 */
async function updateApplicationStatus(applicationId, newStatus) {
  const { data, error } = await supabaseAdmin
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get aggregate statistics for all application statuses
 */
async function getApplicationStats() {
  const statuses = ['lab_pending', 'hod_pending', 'principal_pending', 'approved', 'rejected'];
  
  const countPromises = statuses.map(s => 
    supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', s)
  );

  const results = await Promise.all(countPromises);
  
  const stats = {};
  let total = 0;
  statuses.forEach((s, i) => {
    const count = results[i].count || 0;
    stats[s] = count;
    total += count;
  });
  stats.total = total;

  return stats;
}

module.exports = {
  getProfileByUid,
  getApplicationsByStatus,
  getStudentApplication,
  updateApplicationStatus,
  getApplicationStats
};
