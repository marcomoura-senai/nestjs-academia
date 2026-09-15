import { expect, it, describe } from '@jest/globals';

import { removeAccents } from './remove-accents';

describe('removeAccents', () => {
  it('should remove accents from a string', () => {
    const content = 'áéíóúêôû';
    const result = removeAccents(content);

    expect(result).toBe('aeioueou');
  });

  it('should return the same string if it does not contain accents', () => {
    const content = 'abcdefghijklmnopqrstuvwxyz';
    const result = removeAccents(content);

    expect(result).toBe(content);
  });

  it('should return the same string if it contains only numbers', () => {
    const content = '102';
    const result = removeAccents(content);

    expect(result).toBe(content);
  });
});
