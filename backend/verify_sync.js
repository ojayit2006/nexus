require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function verifySync() {
  const { data: user } = await supabase.from('users').select('*').eq('email', 'arjun@nexus.dev').single();
  if (!user) return console.log('Arjun not found');

  const userId = user.id;
  const { data: apps } = await supabase.from('applications').select('*').eq('user_id', userId).order('submitted_at', { ascending: false }).limit(1);
  
  if (!apps || apps.length === 0) {
    console.log('No apps found for Arjun');
    return;
  }

  const appId = apps[0].id;
  const [deptRes, docsRes, certRes] = await Promise.all([
    supabase.from('department_status').select('*').eq('application_id', appId),
    supabase.from('documents').select('*').eq('application_id', appId),
    supabase.from('certificates').select('*').eq('user_id', userId)
  ]);

  console.log('--- SYNC VERIFICATION FOR ARJUN ---');
  console.log('App ID:', appId);
  console.log('App Status:', apps[0].status);
  console.log('Departments found:', deptRes.data?.length || 0);
  console.log('Documents found:', docsRes.data?.length || 0);
  console.log('Certificates found:', certRes.data?.length || 0);

  if (deptRes.data?.length === 0) {
    console.log('ERROR: Departments array is empty in sync payload!');
  }
}

verifySync().catch(console.error);
