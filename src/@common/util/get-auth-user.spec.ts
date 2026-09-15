import { expect, it, describe } from '@jest/globals';
import { getAuthUser } from './get-auth-user';
import { Request } from 'express';

describe('getAuthUser', () => {
  it('should return the user', () => {
    const user = {
      id: 1,
    };
    const req = {
      user: user,
    } as unknown as Request; // Mock da requisição
    const result = getAuthUser(req);

    expect(result).toEqual(user);
  });

  it('should return undefined if the user is not defined', () => {
    const req = {} as unknown as Request; // Mock da requisição
    const result = getAuthUser(req);

    expect(result).toBeUndefined();
  });
});
