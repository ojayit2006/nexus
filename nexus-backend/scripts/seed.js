require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  try {
    const sqlPath = path.join(__dirname, '../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Supabase JS client doesn't have a direct 'run raw sql' method in the public API
    // usually you'd use the SQL editor in the dashboard.
    // However, if we have the service role key, we can try to use the 'rpc' method 
    // IF there's a stored procedure to execute SQL, which is unlikely in a fresh DB.
    
    console.log('--- DATABASE SQL FILE DETECTED ---');
    console.log('Note: To apply this SQL, it is highly recommended to copy the content of database.sql');
    console.log('and paste it directly into the Supabase SQL Editor:');
    console.log(`${supabaseUrl}/project/_/sql`);
    console.log('----------------------------------');
    
    // We will attempt to check connection
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('Profiles table not found. You likely need to run the SQL in database.sql first.');
    } else {
      console.log(`Connected! Profiles table exists. Total records: ${data.count || 0}`);
    }

  } catch (error) {
    console.error('Seeding error:', error);
  }
}

seed();
