require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function fix() {
  const { data: user } = await supabase.from('users').select('id').eq('email', 'arjun@nexus.dev').single();
  const { data: app } = await supabase.from('applications').select('id').eq('user_id', user.id).single();
  const appId = app.id;
  console.log('App ID:', appId);

  // Delete bad records (had wrong 'name' column)
  const { error: delErr } = await supabase.from('department_status').delete().eq('application_id', appId);
  if (delErr) console.error('Delete error:', delErr.message);
  else console.log('Deleted old dept records');

  // Re-insert with correct schema matching the real table
  const depts = [
    { application_id: appId, department: 'Library',    authority: 'Mr. Desai — Librarian',           status: 'Cleared', flag_reason: 'All items returned, no dues.' },
    { application_id: appId, department: 'Hostel',     authority: 'Mrs. Verma — Warden',             status: 'Cleared', flag_reason: 'Room vacated, no repair dues.' },
    { application_id: appId, department: 'Accounts',   authority: 'Mr. Sharma — Accountant',         status: 'Cleared', flag_reason: 'All fees paid.' },
    { application_id: appId, department: 'Sports',     authority: 'Mr. Singh — Sports Director',     status: 'Cleared', flag_reason: 'No dues.' },
    { application_id: appId, department: 'Laboratory', authority: 'Dr. Mehta — Lab In-charge',       status: 'Cleared', flag_reason: 'All equipment returned.' },
    { application_id: appId, department: 'Placement',  authority: 'Ms. Kapoor — Placement Officer',  status: 'Cleared', flag_reason: 'Registration complete.' },
  ];

  const { error } = await supabase.from('department_status').insert(depts);
  if (error) { console.error('Insert error:', error.message); return; }
  console.log('✅ Inserted 6 cleared departments correctly!');
  console.log('Login: arjun@nexus.dev / test1234');
}

fix().catch(console.error);
