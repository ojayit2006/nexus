/**
 * seed_cleared_student.js
 * Run with: node backend/seed_cleared_student.js
 *
 * Creates a fully-cleared student "Arjun Mehta" with:
 *  - User account (role: student)
 *  - Submitted clearance application
 *  - 6 departments all set to 'Cleared'
 *  - 3 verified documents
 *  - 1 issued No-Dues Certificate
 */

require('dotenv').config({ path: './backend/.env' });

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function seed() {
  console.log('🌱 Seeding fully-cleared student...\n');

  // ── 1. Create user ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('test1234', 10);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert([{
      name: 'Arjun Mehta',
      email: 'arjun@nexus.dev',
      password: passwordHash,
      role: 'student',
      roll_number: '21CS099',
      batch: '2021-2025',
      programme: 'Computer Science',
    }])
    .select('*')
    .single();

  if (userErr) {
    // If already exists, fetch existing
    if (userErr.code === '23505') {
      console.log('ℹ️  User already exists — fetching...');
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'arjun@nexus.dev')
        .single();
      return runWithUser(existing);
    }
    console.error('❌ User creation failed:', userErr.message);
    process.exit(1);
  }

  console.log(`✅ User created: ${user.name} (${user.email})  ID: ${user.id}`);
  await runWithUser(user);
}

async function runWithUser(user) {
  const userId = user.id;

  // ── 2. Create application ───────────────────────────────────────────────────
  const { data: existingApps } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  let appId;
  if (existingApps && existingApps.length > 0) {
    appId = existingApps[0].id;
    console.log(`ℹ️  Application already exists: ${appId}`);

    // Update to fully cleared
    await supabase.from('applications').update({
      status: 'fully_cleared',
      current_stage: 'completed',
      cert_status: 'Ready',
    }).eq('id', appId);
    console.log('✅ Application updated to fully_cleared');
  } else {
    const { data: app, error: appErr } = await supabase
      .from('applications')
      .insert([{
        user_id: userId,
        status: 'fully_cleared',
        current_stage: 'completed',
        cert_status: 'Ready',
        submitted_at: new Date().toISOString(),
      }])
      .select('id')
      .single();

    if (appErr) { console.error('❌ App creation failed:', appErr.message); process.exit(1); }
    appId = app.id;
    console.log(`✅ Application created: ${appId}`);
  }

  // ── 3. Department statuses ─────────────────────────────────────────────────
  const departments = [
    { name: 'Library',    authority: 'Librarian',          department: 'library' },
    { name: 'Hostel',     authority: 'Warden',             department: 'hostel' },
    { name: 'Accounts',   authority: 'Accountant',         department: 'accounts' },
    { name: 'Sports',     authority: 'Sports Director',    department: 'sports' },
    { name: 'Laboratory', authority: 'Lab In-charge',      department: 'lab' },
    { name: 'Placement',  authority: 'Placement Officer',  department: 'placement' },
  ];

  for (const dept of departments) {
    const { data: existing } = await supabase
      .from('department_status')
      .select('id')
      .eq('application_id', appId)
      .eq('department', dept.department)
      .single();

    if (existing) {
      await supabase.from('department_status')
        .update({ status: 'Cleared', flag_reason: 'All dues cleared.', cleared_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase.from('department_status').insert([{
        application_id: appId,
        department: dept.department,
        name: dept.name,
        authority: dept.authority,
        status: 'Cleared',
        flag_reason: 'All dues cleared.',
        cleared_at: new Date().toISOString(),
      }]);
    }
    console.log(`  ✅ ${dept.name} → Cleared`);
  }

  // ── 4. Verified documents ──────────────────────────────────────────────────
  const docs = [
    { name: 'Bonafide Certificate.pdf', doc_type: 'Bonafide' },
    { name: 'NOC from Hostel.pdf',      doc_type: 'NOC' },
    { name: 'Fee Clearance.pdf',        doc_type: 'Fee Receipt' },
  ];

  for (const doc of docs) {
    const { data: existing } = await supabase
      .from('documents')
      .select('id')
      .eq('application_id', appId)
      .eq('name', doc.name)
      .single();

    if (!existing) {
      await supabase.from('documents').insert([{
        application_id: appId,
        name: doc.name,
        doc_type: doc.doc_type,
        file_path: `local/${doc.name}`,
        status: 'Verified',
      }]);
    } else {
      await supabase.from('documents').update({ status: 'Verified' }).eq('id', existing.id);
    }
    console.log(`  ✅ Doc: ${doc.name} → Verified`);
  }

  // ── 5. Issue certificate ───────────────────────────────────────────────────
  const certId = `NX-CERT-${new Date().getFullYear()}-DEMO`;
  const { data: existingCert } = await supabase
    .from('certificates')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!existingCert) {
    await supabase.from('certificates').insert([{
      user_id: userId,
      application_id: appId,
      certificate_id: certId,
      file_path: `certificates/${certId}.pdf`,
      issued_at: new Date().toISOString(),
    }]);
    console.log(`  ✅ Certificate issued: ${certId}`);
  } else {
    console.log(`  ℹ️  Certificate already exists: ${existingCert.id}`);
  }

  console.log('\n🎓 DONE! Login credentials:');
  console.log('   Email   : arjun@nexus.dev');
  console.log('   Password: test1234');
  console.log('   Role    : student');
  console.log('\nAll 6 departments are Cleared. No-Dues Certificate is unlocked.');
}

seed().catch(console.error);
