import { jest } from '@jest/globals';
import { generateHash, compareHash } from '../../helper/bcrypt.js';

describe('Bcrypt Helper', () => {
  describe('generateHash', () => {
    it('should generate a hash from password', async () => {
      const password = 'testPassword123';
      const hash = await generateHash(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await generateHash(password);
      const hash2 = await generateHash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const hash = await generateHash('');
      expect(hash).toBeDefined();
    });
  });

  describe('compareHash', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hash = await generateHash(password);

      const result = await compareHash(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hash = await generateHash(password);

      const result = await compareHash(wrongPassword, hash);
      expect(result).toBe(false);
    });

    it('should handle special characters in password', async () => {
      const password = 'test@Password!#$%123';
      const hash = await generateHash(password);

      const result = await compareHash(password, hash);
      expect(result).toBe(true);
    });
  });
});
