import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JwtPayload {
  id: string | Types.ObjectId;
  role?: string;
}

/**
 * Convertit une durée en chaîne en secondes
 */
const convertToSeconds = (timeString: string | undefined): number => {
  if (!timeString) {
    return 60 * 60 * 24 * 30; // 30 jours par défaut
  }

  const units: { [key: string]: number } = {
    s: 1,          // secondes
    m: 60,         // minutes
    h: 60 * 60,    // heures
    d: 60 * 60 * 24, // jours
    w: 60 * 60 * 24 * 7, // semaines
  };

  const match = timeString.match(/^(\d+)([smhdw])$/);
  if (match && match[1] && match[2]) {
    const value = parseInt(match[1]);
    const unit = match[2];
    const unitMultiplier = units[unit];
    
    if (unitMultiplier && !isNaN(value)) {
      return value * unitMultiplier;
    }
  }

  // Fallback: essayer de parser comme nombre de secondes
  const seconds = parseInt(timeString);
  return isNaN(seconds) ? 60 * 60 * 24 * 30 : seconds;
};

/**
 * Génère un token JWT
 */
export const generateToken = (userId: string | Types.ObjectId, role?: string): string => {
  // Validation des paramètres
  if (!userId) {
    throw new Error('User ID is required');
  }

  const payload: JwtPayload = { id: userId };
  
  if (role) {
    payload.role = role;
  }

  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Convertir en secondes (nombre)
  const expiresIn = convertToSeconds(process.env.JWT_EXPIRES_IN);

  const options: jwt.SignOptions = {
    expiresIn,
  };

  try {
    return jwt.sign(payload, secret, options);
  } catch (error) {
    throw new Error(`Erreur lors de la génération du token: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): JwtPayload => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string');
  }

  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secret);
    
    // Vérification robuste du payload
    if (typeof decoded === 'string') {
      throw new Error('Token payload invalide: expected object, got string');
    }

    const payload = decoded as JwtPayload;
    
    if (!payload.id) {
      throw new Error('Token payload invalide: missing id field');
    }

    return payload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Token JWT invalide: ${error.message}`);
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expiré');
    } else if (error instanceof Error) {
      throw new Error(`Erreur de vérification du token: ${error.message}`);
    }
    throw new Error('Erreur inconnue lors de la vérification du token');
  }
};

/**
 * Extrait le token du header Authorization
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
};

/**
 * Vérifie si un token est sur le point d'expirer (dans les 15 minutes)
 */
export const isTokenExpiringSoon = (token: string, thresholdMinutes: number = 15): boolean => {
  try {
    const payload = verifyToken(token);
    
    // jwt.verify vérifie déjà l'expiration, donc si nous sommes ici, le token n'est pas encore expiré
    // Pour vérifier s'il expire bientôt, nous devrions décoder sans vérifier l'expiration
    const decoded = jwt.decode(token);
    
    if (typeof decoded === 'string' || !decoded || !decoded.exp) {
      return false;
    }

    const expTimestamp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const threshold = thresholdMinutes * 60;

    return (expTimestamp - now) <= threshold;
  } catch {
    return false;
  }
};