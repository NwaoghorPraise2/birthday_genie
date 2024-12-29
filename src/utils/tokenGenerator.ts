class GenerateVerificationToken {
    static verificationToken(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    static expiresAt(): Date {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    static resetPasswordToken(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    static resetPasswordTokenExpiresAt(): Date {
        return new Date(Date.now() + 10 * 60 * 1000);
    }
}

export default {
    verificationToken: GenerateVerificationToken.verificationToken(),
    verificationTokenExpiresAt: GenerateVerificationToken.expiresAt(),
    resetPasswordToken: GenerateVerificationToken.resetPasswordToken(),
    resetPasswordTokenExpiresAt: GenerateVerificationToken.resetPasswordTokenExpiresAt()
};

