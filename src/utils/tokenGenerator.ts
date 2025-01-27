import crypto from 'crypto';

class GenerateVerificationToken {
    // Arrow function to preserve lexical 'this' scope
    static generateSecureToken = (length: number = 4): string => {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };

    static expiresAt = (expirationTime: number = 24 * 60 * 60 * 1000): Date => {
        return new Date(Date.now() + expirationTime);
    };

    static resetPasswordToken = (): string => {
        return this.generateSecureToken(6); // 6 hex characters for more complexity
    };

    static resetPasswordTokenExpiresAt = (expirationTime: number = 10 * 60 * 1000): Date => {
        return new Date(Date.now() + expirationTime);
    };
}

// Exporting functions, which will now be arrow functions
export default {
    verificationToken: GenerateVerificationToken.generateSecureToken,
    verificationTokenExpiresAt: GenerateVerificationToken.expiresAt,
    resetPasswordToken: GenerateVerificationToken.resetPasswordToken,
    resetPasswordTokenExpiresAt: GenerateVerificationToken.resetPasswordTokenExpiresAt
};

