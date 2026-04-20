require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function inspectArjun() {
  console.log('--- Inspecting Arjun Mehta ---');
  const { data: user } = await supabase.from('users').select('*').eq('email', 'arjun@nexus.dev').single();
  if (!user) {
    console.log('User arjun@nexus.dev not found');
    return;
  }
  console.log('User ID:', user.id);

  const { data: apps } = await supabase.from('applications').select('*').eq('user_id', user.id);
  console.log('Applications found:', apps.length);
  apps.forEach(app => console.log(` - App ID: ${app.id}, Status: ${app.status}, Submitted At: ${app.submitted_at}`));

  if (apps.length > 0) {
    const latestApp = apps.sort((a,b) => new Date(b.submitted_at) - new Date(a.submitted_at))[0];
    console.log('Latest App:', latestApp.id);

    const { data: depts } = await supabase.from('department_status').select('*').eq('application_id', latestApp.id);
    console.log('Departments linked to latest app:', depts.length);
    depts.forEach(d => console.log(`   * ${d.department}: ${d.status}`));

    const { data: allDepts } = await supabase.from('department_status').select('*');
    const orphanDepts = allDepts.filter(d => !apps.map(a => a.id).includes(d.application_id));
    console.log('Orphan department records (not linked to Arjun\'s apps):', orphanDepts.length);
  }
}

inspectArjun().catch(console.error);
