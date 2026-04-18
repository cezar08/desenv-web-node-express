import { User } from '../models/index.js';
import { verifyAccessToken } from '../services/jwt.service.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization ?? '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token ausente ou inválido' });
  }

  try {
    const payload = verifyAccessToken(token);
    const userId = Number.parseInt(payload.sub, 10);
    if (Number.isNaN(userId)) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ message: 'Usuário do token não encontrado' });
    }

    req.authUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

