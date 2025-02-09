import crypto from 'crypto';

class GenerateVerificationToken {
    static generateSecureToken = (length: number = 4): string => {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };

    static expiresAt = (expirationTime: number = 15 * 60 * 1000): Date => {
        return new Date(Date.now() + expirationTime);
    };

    static resetPasswordToken = (): string => {
        return this.generateSecureToken(6);
    };

    static resetPasswordTokenExpiresAt = (expirationTime: number = 10 * 60 * 1000): Date => {
        return new Date(Date.now() + expirationTime);
    };
}

export default {
    verificationToken: GenerateVerificationToken.generateSecureToken,
    verificationTokenExpiresAt: GenerateVerificationToken.expiresAt,
    resetPasswordToken: GenerateVerificationToken.resetPasswordToken,
    resetPasswordTokenExpiresAt: GenerateVerificationToken.resetPasswordTokenExpiresAt
};

