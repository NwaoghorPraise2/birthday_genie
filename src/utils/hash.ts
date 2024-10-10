/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import bcrypt from 'bcrypt';
import config from '../config/config';

/**
 * PasswordHelpers Class provides utility methods for password hashing and comparison.
 * 
 * - Hashing: Generates a hashed version of a plaintext password using bcrypt.
 * - Comparison: Compares a plaintext password with a hashed password to verify authenticity.
 * 
 * Key Considerations:
 * - Security: Utilizes bcrypt, a widely adopted hashing library, to ensure passwords are securely stored.
 * - Salt Configuration: The number of salt rounds used for hashing is configurable through environment variables.
 * - Async Operations: Methods are asynchronous, allowing for non-blocking operations during password processing.
 */
class PasswordHelpers {
    /**
     * Hashes a plaintext password.
     *
     * @param password - The plaintext password to be hashed
     * @returns A promise that resolves to the hashed password
     */
    public static async hashPassword(password: string) {
        return await bcrypt.hash(password, Number(config.HASH_SALT));
    }

    /**
     * Compares a plaintext password with a hashed password.
     *
     * @param password - The plaintext password to compare
     * @param hashPassword - The hashed password to compare against
     * @returns A promise that resolves to a boolean indicating if the passwords match
     */
    public static async comparePassword(password: string, hashPassword: string) {
        return await bcrypt.compare(password, hashPassword);
    }
}

export default PasswordHelpers;
