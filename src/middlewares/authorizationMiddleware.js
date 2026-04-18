const rolePermissions = {
  admin: ['users:read', 'users:update', 'users:delete', 'posts:read', 'posts:create'],
  visitante: ['posts:read', 'posts:create'],
};

export function hasPermission(role, permission) {
  const permissions = rolePermissions[role] ?? [];
  return permissions.includes(permission);
}

export const requireRole = (...allowedRoles) => (req, res, next) => {
  const userRole = req.authUser?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: 'Acesso negado para este perfil' });
  }

  return next();
};

export const requirePermission = (permission) => (req, res, next) => {
  const userRole = req.authUser?.role;
  if (!userRole || !hasPermission(userRole, permission)) {
    return res.status(403).json({ message: 'Permissão insuficiente para este recurso' });
  }

  return next();
};

export { rolePermissions };

