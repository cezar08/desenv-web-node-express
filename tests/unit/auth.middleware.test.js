import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/services/jwt.service.js', () => ({
  verifyAccessToken: vi.fn(),
}));

vi.mock('../../src/models/index.js', () => ({
  User: {
    findByPk: vi.fn(),
  },
}));

import { verifyAccessToken } from '../../src/services/jwt.service.js';
import { User } from '../../src/models/index.js';
import { requireAuth } from '../../src/middlewares/authMiddleware.js';

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

describe('authMiddleware.requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 401 sem Authorization', async () => {
    const req = { headers: {} };
    const res = createRes();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 401 quando token é inválido', async () => {
    verifyAccessToken.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const req = { headers: { authorization: 'Bearer token-invalido' } };
    const res = createRes();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 401 quando usuário não existe', async () => {
    verifyAccessToken.mockReturnValue({ sub: '42' });
    User.findByPk.mockResolvedValue(null);

    const req = { headers: { authorization: 'Bearer token-valido' } };
    const res = createRes();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next quando token e usuário são válidos', async () => {
    verifyAccessToken.mockReturnValue({ sub: '1' });
    User.findByPk.mockResolvedValue({ id: 1, email: 'user@mail.com', name: 'User', role: 'visitante' });

    const req = { headers: { authorization: 'Bearer token-ok' } };
    const res = createRes();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.authUser).toEqual({ id: 1, email: 'user@mail.com', name: 'User', role: 'visitante' });
  });
});

