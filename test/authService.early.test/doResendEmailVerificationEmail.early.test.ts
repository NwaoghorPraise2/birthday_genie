// Unit tests for: doResendEmailVerificationEmail

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import {IUser} from '../../src/types/auth.types';
import GlobalError from '../../src/utils/HttpsErrors';
import emailEmitter from '../../src/utils/mail/emitter';
import generateTokens from '../../src/utils/tokenGenerator';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/mail/emitter');
jest.mock('../../utils/tokenGenerator');

describe('AuthService.doResendEmailVerificationEmail() doResendEmailVerificationEmail method', () => {
    const mockUser: IUser = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        isVerified: false,
        verificationToken: 'oldToken',
        verificationTokenExpiresAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should resend verification email for an unverified user', async () => {
            // Arrange
            (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            const newVerificationToken = 'newToken';
            const newVerificationTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour later
            (generateTokens as jest.Mock).mockReturnValue({
                verificationToken: newVerificationToken,
                verificationTokenExpiresAt: newVerificationTokenExpiresAt
            });

            // Act
            await AuthService.doResendEmailVerificationEmail(mockUser.email);

            // Assert
            expect(AuthRepository.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(AuthRepository.updateVerificationToken).toHaveBeenCalledWith(mockUser.id, newVerificationToken, newVerificationTokenExpiresAt);
            expect(emailEmitter.emit).toHaveBeenCalledWith('Verification-Email', {
                email: mockUser.email,
                name: mockUser.username,
                verificationToken: newVerificationToken
            });
        });
    });

    describe('Edge cases', () => {
        it('should throw an error if the user does not exist', async () => {
            // Arrange
            (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.doResendEmailVerificationEmail('nonexistent@example.com')).rejects.toThrow(
                new GlobalError(400, responseMessage.NOT_FOUND('User with nonexistent@example.com '))
            );
        });

        it('should throw an error if the user is already verified', async () => {
            // Arrange
            const verifiedUser = {...mockUser, isVerified: true};
            (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(verifiedUser);

            // Act & Assert
            await expect(AuthService.doResendEmailVerificationEmail(verifiedUser.email)).rejects.toThrow(
                new GlobalError(400, responseMessage.ALREADY_VERIFIED)
            );
        });
    });
});

// End of unit tests for: doResendEmailVerificationEmail
