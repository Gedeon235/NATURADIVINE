// src/controllers/authControllerSimple.ts - VERSION COMMONJS
import { Request, Response } from 'express';

const register = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({
    success: true,
    message: 'Utilisateur créé avec succès',
    data: {
      _id: '123',
      name: req.body.name,
      email: req.body.email,
      token: 'token_test'
    }
  });
};

const login = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: {
      _id: '123',
      name: 'Test User',
      email: req.body.email,
      token: 'token_test'
    }
  });
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {
      _id: '123',
      name: 'Test User',
      email: 'test@example.com'
    }
  });
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Profil mis à jour',
    data: req.body
  });
};

const updatePassword = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Mot de passe modifié'
  });
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Email de réinitialisation envoyé'
  });
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Mot de passe réinitialisé'
  });
};

// Export CommonJS
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword
};