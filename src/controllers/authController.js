import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { signAccessToken } from '../services/jwt.service.js';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email e password são obrigatórios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'password deve conter ao menos 6 caracteres' });
  }

  const allowedRoles = ['admin', 'visitante'];
  const normalizedRole = role ?? 'visitante';
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: 'role inválida. Use: admin ou visitante' });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: normalizedRole });

  return res.status(201).json(sanitizeUser(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email e password são obrigatórios' });
  }

  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const accessToken = signAccessToken(user);

  return res.json({
    accessToken,
    tokenType: 'Bearer',
    user: sanitizeUser(user),
  });
};

