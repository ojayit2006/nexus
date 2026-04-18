import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../config/supabase.js';

/**
 * verifyToken Middleware
 * Supports both profiles and authority_profiles tables.
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const source = decoded.source || 'profiles';

    if (source === 'authority_profiles') {
      const { data: profile, error } = await supabaseAdmin
        .from('authority_profiles')
        .select('id, email, role, name')
        .eq('id', decoded.userId)
        .maybeSingle();

      if (error || !profile) {
        return res.status(401).json({ error: 'Account not found' });
      }

      req.user = {
        userId: profile.id,
        uid: profile.email,
        role: profile.role,
        branch: null,
        source: 'authority_profiles'
      };
    } else {
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('id, uid, role, branch')
        .eq('id', decoded.userId)
        .maybeSingle();

      if (error || !profile) {
        return res.status(401).json({ error: 'Account not found' });
      }

      req.user = {
        userId: profile.id,
        uid: profile.uid,
        role: profile.role,
        branch: profile.branch,
        source: 'profiles'
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * requireRole Middleware
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

/**
 * requireStudent Middleware
 */
export const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ error: 'Student access only' });
  }
  next();
};
