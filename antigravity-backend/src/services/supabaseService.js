import { supabaseAdmin } from '../../config/supabase.js';

/**
 * Generic service for supabase operations
 */
export const getProfileByUid = async (uid) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('uid', uid)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateApplicationStatusInDb = async (applicationId, status) => {
  const { data, error } = await supabaseAdmin
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
