import { supabaseAdmin } from '../../config/supabase.js';
import logger from '../utils/logger.js';

/**
 * Helper: Map status to human-readable label
 */
const getStatusLabel = (status) => {
  const labels = {
    lab_pending: 'Awaiting Lab Clearance',
    hod_pending: 'Awaiting HOD Approval',
    principal_pending: 'Awaiting Principal Approval',
    approved: 'Fully Approved',
    rejected: 'Rejected'
  };
  return labels[status] || status;
};

/**
 * Helper: Map status to next step description
 */
const getNextStep = (status) => {
  const steps = {
    lab_pending: 'Your application is in the lab review queue',
    hod_pending: 'Lab cleared. Awaiting HOD review.',
    principal_pending: 'HOD approved. Awaiting Principal sign-off.',
    approved: 'Clearance complete. No further action needed.',
    rejected: 'Application rejected. Contact your department.'
  };
  return steps[status] || '';
};

/**
 * POST /api/applications/submit
 */
export const submit = async (req, res) => {
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
      return res.status(409).json({ 
        error: 'You already have an active clearance application', 
        existingApplication: activeApp 
      });
    }

    // 2. Check if already approved
    const { data: approvedApp } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('student_uid', studentUid)
      .eq('status', 'approved')
      .maybeSingle();

    if (approvedApp) {
      return res.status(409).json({ error: 'Your clearance has already been approved' });
    }

    // 3. Insert new application
    const { data: application, error: insertError } = await supabaseAdmin
      .from('applications')
      .insert([{ student_uid: studentUid, status: 'lab_pending' }])
      .select()
      .single();

    if (insertError) throw insertError;

    logger.info(`New application submitted by ${studentUid}`);

    return res.status(201).json({ 
      success: true,
      application, 
      message: 'Application submitted. Awaiting lab clearance.' 
    });

  } catch (error) {
    logger.error(`Application submit error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/applications/my-status
 */
export const myStatus = async (req, res) => {
  try {
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('student_uid', req.user.uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!application) {
      return res.status(200).json({ 
        application: null, 
        message: 'No application found. Submit one to begin clearance.' 
      });
    }

    return res.status(200).json({ 
      success: true,
      application, 
      statusLabel: getStatusLabel(application.status), 
      nextStep: getNextStep(application.status) 
    });

  } catch (error) {
    logger.error(`GetStatus error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/applications/history
 */
export const history = async (req, res) => {
  try {
    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('student_uid', req.user.uid)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ 
      success: true,
      applications, 
      total: applications.length 
    });

  } catch (error) {
    logger.error(`History error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
