
class GenerateVerificationToken {
    static verificationToken(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    } 

    static expiresAt(): Date {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); 
    }
    // resetPasswordToken
    // resetPasswordTokenExpiresAt 
} 

export default {
    verificationToken: GenerateVerificationToken.verificationToken(),
    verificationTokenExpiresAt: GenerateVerificationToken.expiresAt()
}