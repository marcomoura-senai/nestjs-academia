import { expect, it, describe, beforeAll } from '@jest/globals';
import { JwtService } from './jwt.service';
import { AuthUserDto } from '../@common/dto/auth-user.dto';
import { RolesEnum } from '../roles/roles.entity';
import { isJWT } from 'class-validator';

describe(JwtService.name, () => {
  beforeAll(() => {
    process.env.MODE = 'test';
    process.env.JWT_SECRET = 'secret123';
    process.env.JWT_CIPHER_KEY =
      'e3ba0ae5d6bfac407f1dee90c15aaab78c9e471cb09ebda5861e06b66840a22f';
  });

  describe('sign', () => {
    it('should sign a payload', () => {
      const payload: AuthUserDto['data'] = {
        especialidade: 'Engenharia de Software',
        id: 1,
        nome: 'John Doe',
        registro: '2023-01-01',
        roles: [RolesEnum.ADMIN],
      };

      const service = new JwtService();

      const result = service.sign(payload);

      expect(typeof result).toBe('string');
      expect(isJWT(result)).toBe(true);
    });
  });

  describe('verify', () => {
    it('should verify a payload', () => {
      const payload: AuthUserDto['data'] = {
        especialidade: 'Engenharia de Software',
        id: 1,
        nome: 'John Doe',
        registro: '2023-01-01',
        roles: [RolesEnum.ADMIN],
      };

      const service = new JwtService();

      const jwt = service.sign(payload);

      const result = service.verify(jwt);

      const iatDate = new Date(result.iat ?? 0);
      const expDate = new Date(result.exp ?? 0);

      const interval = expDate.getTime() - iatDate.getTime();

      const diff = Math.abs(interval / 60 / 60);

      expect(diff).toBe(8);
      expect(interval).toBeGreaterThan(0);

      expect(typeof result).toBe('object');
      expect(result.iss).toBe('sctec');

      expect(result.data).toEqual(payload);
    });
  });
});
