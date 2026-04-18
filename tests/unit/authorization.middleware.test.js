import { describe, expect, it, vi } from 'vitest';
import { hasPermission, requirePermission, requireRole } from '../../src/middlewares/authorizationMiddleware.js';

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('authorizationMiddleware.hasPermission', () => {
  it('retorna true quando a role tem a permissão', () => {
    expect(hasPermission('admin', 'users:delete')).toBe(true);
    expect(hasPermission('visitante', 'posts:read')).toBe(true);
  });

  it('retorna false quando a role não tem a permissão', () => {
    expect(hasPermission('visitante', 'users:delete')).toBe(false);
    expect(hasPermission('unknown', 'posts:read')).toBe(false);
  });
});

describe('authorizationMiddleware.requireRole', () => {
  it('retorna 403 quando role não permitida', () => {
    const req = { authUser: { role: 'visitante' } };
    const res = createRes();
    const next = vi.fn();

    requireRole('admin')(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next quando role permitida', () => {
    const req = { authUser: { role: 'admin' } };
    const res = createRes();
    const next = vi.fn();

    requireRole('admin', 'visitante')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('authorizationMiddleware.requirePermission', () => {
  it('retorna 403 quando não possui permissão', () => {
    const req = { authUser: { role: 'visitante' } };
    const res = createRes();
    const next = vi.fn();

    requirePermission('users:read')(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next quando possui permissão', () => {
    const req = { authUser: { role: 'visitante' } };
    const res = createRes();
    const next = vi.fn();

    requirePermission('posts:read')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

