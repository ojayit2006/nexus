import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { supabaseAdmin } from '../../config/supabase.js';
import logger from '../utils/logger.js';

/**
 * POST /api/auth/login
 * Unified login: all users login with email + password.
 * Students: password = their uid
 * Authorities: password from authority_profiles table
 */
export const login = async (req, res) => {
  try {
    // 1. Validate Input
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error: validationError, value } = schema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { email, password } = value;

    // 2. Try student login first (profiles table)
    const { data: studentProfile, error: studentError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (studentProfile) {
      // Student found — password must equal their uid
      if (password !== studentProfile.uid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Sign tokens
      const accessToken = jwt.sign(
        {
          userId: studentProfile.id,
          uid: studentProfile.uid,
          role: studentProfile.role || 'student',
          branch: studentProfile.branch,
          source: 'profiles'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: studentProfile.id, uid: studentProfile.uid, source: 'profiles' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`Student login: ${studentProfile.name} (${studentProfile.uid})`);

      return res.status(200).json({
        user: {
          id: studentProfile.id,
          uid: studentProfile.uid,
          name: studentProfile.name,
          role: studentProfile.role || 'student',
          branch: studentProfile.branch,
          email: studentProfile.email
        },
        accessToken,
        refreshToken
      });
    }

    // 3. Try authority login (authority_profiles table)
    const { data: authorityProfile, error: authorityError } = await supabaseAdmin
      .from('authority_profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!authorityProfile) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    if (password !== authorityProfile.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign tokens for authority
    const accessToken = jwt.sign(
      {
        userId: authorityProfile.id,
        uid: authorityProfile.email,
        role: authorityProfile.role,
        branch: null,
        source: 'authority_profiles'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: authorityProfile.id, uid: authorityProfile.email, source: 'authority_profiles' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`Authority login: ${authorityProfile.name} (${authorityProfile.role})`);

    return res.status(200).json({
      user: {
        id: authorityProfile.id,
        uid: authorityProfile.email,
        name: authorityProfile.name,
        role: authorityProfile.role,
        branch: null,
        email: authorityProfile.email
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/refresh
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check which table the user belongs to
    let profile = null;
    let source = decoded.source || 'profiles';

    if (source === 'authority_profiles') {
      const { data } = await supabaseAdmin
        .from('authority_profiles')
        .select('*')
        .eq('id', decoded.userId)
        .maybeSingle();
      profile = data;
    } else {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', decoded.userId)
        .maybeSingle();
      profile = data;
    }

    if (!profile) {
      return res.status(401).json({ error: 'User not found' });
    }

    const accessToken = jwt.sign(
      {
        userId: profile.id,
        uid: source === 'authority_profiles' ? profile.email : profile.uid,
        role: profile.role,
        branch: profile.branch || null,
        source
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ accessToken });

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const source = req.user.source || 'profiles';
    let profile = null;

    if (source === 'authority_profiles') {
      const { data, error } = await supabaseAdmin
        .from('authority_profiles')
        .select('*')
        .eq('id', req.user.userId)
        .single();
      if (error || !data) return res.status(404).json({ error: 'Profile not found' });
      profile = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', req.user.userId)
        .single();
      if (error || !data) return res.status(404).json({ error: 'Profile not found' });
      profile = data;
    }

    // If student, fetch latest application
    let latestApplication = null;
    if (profile.role === 'student' && profile.uid) {
      const { data: app } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('student_uid', profile.uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      latestApplication = app;
    }

    return res.status(200).json({
      profile: {
        id: profile.id,
        uid: profile.uid || profile.email,
        name: profile.name,
        role: profile.role,
        branch: profile.branch || null,
        email: profile.email
      },
      application: latestApplication || null
    });

  } catch (error) {
    logger.error(`GetMe error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
