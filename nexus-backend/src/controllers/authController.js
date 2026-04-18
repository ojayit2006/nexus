const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../../config/supabase');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * Login user using email and password
 * Students use UID as password
 * Authority users use their stored password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    let user = null;
    let role = null;

    // 1. Try to find user in 'profiles' (Students)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profile) {
      // For students, UID = Password
      if (password === profile.uid) {
        user = profile;
        role = 'student';
      } else {
        return sendError(res, 401, 'Invalid credentials');
      }
    } else {
      // 2. Not a student, check 'authority_profiles'
      const { data: authority, error: authorityError } = await supabaseAdmin
        .from('authority_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (authority) {
        if (password === authority.password) {
          user = authority;
          role = authority.role;
        } else {
          return sendError(res, 401, 'Invalid credentials');
        }
      }
    }

    if (!user) {
      return sendError(res, 401, 'User not found or invalid credentials');
    }

    // 3. Generate JWT Token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET missing');
      return sendError(res, 500, 'Server configuration error');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // 4. Return response
    return sendResponse(res, 200, {
      token,
      user: {
        id: user.id,
        uid: user.uid || null,
        name: user.name,
        branch: user.branch || null,
        email: user.email,
        role: role
      }
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'Internal server error during login');
  }
};

/**
 * Register a new user
 * Expects: uid, name, branch, email, role
 */
const signup = async (req, res) => {
  try {
    const { email, password, name, branch, role = 'student', uid } = req.body;

    if (!email || !name) {
      return sendError(res, 400, 'Email and name are required');
    }

    if (role === 'student') {
      if (!uid) return sendError(res, 400, 'UID is required for students');
      
      // Create student profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{ uid, name, branch, email }])
        .select()
        .single();

      if (profileError) throw profileError;

      // Create initial application
      await supabaseAdmin
        .from('applications')
        .insert([{ student_uid: uid, status: 'lab_pending' }]);

      return sendResponse(res, 201, { user: profile }, 'Student registered successfully');
    } else {
      if (!password) return sendError(res, 400, 'Password is required for staff');

      // Create authority profile
      const { data: authority, error: authorityError } = await supabaseAdmin
        .from('authority_profiles')
        .insert([{ email, password, name, role, branch }])
        .select()
        .single();

      if (authorityError) throw authorityError;

      return sendResponse(res, 201, { user: authority }, 'Staff member registered successfully');
    }

  } catch (error) {
    console.error('Signup error:', error);
    return sendError(res, 500, error.message || 'Internal server error during signup');
  }
};

/**
 * Bulk register students from CSV
 * Expects: students: [{ uid, name, branch, email }]
 */
const bulkRegister = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students)) {
      return sendError(res, 400, 'Invalid student data. Array expected.');
    }

    // Filter out invalid records
    const validStudents = students.filter(s => s.uid && s.name && s.email);

    if (validStudents.length === 0) {
      return sendError(res, 400, 'No valid student records found.');
    }

    // 1. Insert into profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(validStudents.map(s => ({
        uid: s.uid,
        name: s.name,
        branch: s.branch,
        email: s.email,
        role: 'student'
      })))
      .select();

    if (profileError) {
      console.error('Bulk profile creation error:', profileError);
      return sendError(res, 500, profileError.message || 'Error creating user profiles');
    }

    // 2. Create initial applications for each student
    const applications = validStudents.map(s => ({
      student_uid: s.uid,
      status: 'lab_pending'
    }));

    const { error: appError } = await supabaseAdmin
      .from('applications')
      .insert(applications);

    if (appError) {
      console.error('Bulk application creation error:', appError);
      // We continue since profiles were created
    }

    return sendResponse(res, 201, { count: profiles.length }, 'Bulk registration successful');

  } catch (error) {
    console.error('Bulk signup error:', error);
    return sendError(res, 500, error.message || 'Internal server error during bulk signup');
  }
};

module.exports = {
  login,
  signup,
  bulkRegister
};
