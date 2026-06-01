import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      schoolId?: string;
      tenantId?: string;
    }
  }
}

if (!admin.apps.length) {
  admin.initializeApp();
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Non autorisé: Token manquant' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { id: decoded.uid, email: decoded.email, role: decoded.role };
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }

  req.schoolId = req.tenantId || (req.headers['x-school-id'] as string | undefined);
  
  // Certains endpoints audit ne nécessitent pas de schoolId (s'ils sont super-admins),
  // on laisse les vérifications se faire dans les contrôleurs si nécessaire.
  
  next();
}

export function restrictToRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé: Rôle insuffisant' });
    }
    next();
  };
}
