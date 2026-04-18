const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.warn('Missing Supabase environment variables. Database connections will fail.');
}

// Client for general operations & client-side-like auth verification
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client that bypasses Row Level Security (RLS) - ideal for backend controllers
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = {
  supabaseClient,
  supabaseAdmin
};
