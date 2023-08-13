import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

/**
 * Service for hashing and comparing passwords using the bcrypt library.
 */
@Injectable()
export class HashService {
  /**
   * Hashes a plaintext password using bcrypt.
   * @param password - The plaintext password to be hashed.
   * @returns Resolves to the hashed password.
   */
  hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  /**
   * Compares a plaintext password with its hashed version to verify if they match.
   * @param password - The plaintext password to compare.
   * @param hashedPassword - The previously stored password in its hashed form.
   * @returns Resolves to `true` if the passwords match, or `false` if they don't.
   * @throws An exception if an error occurs during the comparison process.
   */
  comparePasswords(password: string, hashedPassword: string): boolean {
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  }
}
