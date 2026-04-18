import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
  console.log('Setting up authority_profiles...');
  
  // Try inserting directly — if the table exists, this will work
  const authorities = [
    { name: 'Head of Department', email: 'hod@spit.ac.in', role: 'hod', password: 'hod@123' },
    { name: 'Librarian', email: 'librarian@spit.ac.in', role: 'librarian', password: 'librarian@123' },
    { name: 'Lab Assistant', email: 'labassistant@spit.ac.in', role: 'labassistant', password: 'labassistant@123' },
    { name: 'Principal', email: 'principal@spit.ac.in', role: 'principal', password: 'principal@123' },
    { name: 'Admin', email: 'admin@spit.ac.in', role: 'admin', password: 'admin@123' }
  ];

  const { data, error } = await supabaseAdmin
    .from('authority_profiles')
    .upsert(authorities, { onConflict: 'email' })
    .select();

  if (error) {
    console.error('Insert failed:', error.message);
    console.log('\n⚠️  The "authority_profiles" table does not exist in Supabase yet.');
    console.log('Please run the following SQL in your Supabase Dashboard SQL Editor:\n');
    console.log(`CREATE TABLE IF NOT EXISTS authority_profiles (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        UNIQUE NOT NULL,
  role       TEXT        NOT NULL,
  password   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO authority_profiles (name, email, role, password) VALUES
  ('Head of Department', 'hod@spit.ac.in',          'hod',          'hod@123'),
  ('Librarian',          'librarian@spit.ac.in',    'librarian',    'librarian@123'),
  ('Lab Assistant',      'labassistant@spit.ac.in', 'labassistant', 'labassistant@123'),
  ('Principal',          'principal@spit.ac.in',    'principal',    'principal@123'),
  ('Admin',              'admin@spit.ac.in',        'admin',        'admin@123')
ON CONFLICT (email) DO NOTHING;`);
  } else {
    console.log('✅ Authority profiles inserted successfully!');
    console.log(data);
  }
}

setup();
