// Unit tests for: doForgotPassword

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

describe('AuthService.doForgotPassword() doForgotPassword method', () => {
    const mockUser: IUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should successfully generate a reset password token and send an email', async () => {
            // Arrange
            (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            const mockTokens = {
                resetPasswordToken: 'reset-token',
                resetPasswordTokenExpiresAt: new Date(Date.now() + 3600000) // 1 hour from now
            };
            (generateTokens as jest.Mock).mockReturnValue(mockTokens);

            // Act
            await AuthService.doForgotPassword(mockUser.email);

            // Assert
            expect(AuthRepository.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(AuthRepository.updateResetPasswordToken).toHaveBeenCalledWith(
                mockUser.id,
                mockTokens.resetPasswordToken,
                mockTokens.resetPasswordTokenExpiresAt
            );
            expect(emailEmitter.emit).toHaveBeenCalledWith('Reset-Password-Email', {
                email: mockUser.email,
                name: mockUser.username,
                resetPasswordToken: mockTokens.resetPasswordToken
            });
        });
    });

    describe('Edge cases', () => {
        it('should throw an error if the user is not found', async () => {
            // Arrange
            (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.doForgotPassword('nonexistent@example.com')).rejects.toThrow(
                new GlobalError(400, responseMessage.NOT_FOUND('User with nonexistent@example.com '))
            );
            expect(AuthRepository.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
            expect(AuthRepository.updateResetPasswordToken).not.toHaveBeenCalled();
            expect(emailEmitter.emit).not.toHaveBeenCalled();
        });

        it('should handle the case where token generation fails', async () => {
            // Arrange
            (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (generateTokens as jest.Mock).mockReturnValue(null);

            // Act & Assert
            await expect(AuthService.doForgotPassword(mockUser.email)).rejects.toThrow();
            expect(AuthRepository.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(AuthRepository.updateResetPasswordToken).not.toHaveBeenCalled();
            expect(emailEmitter.emit).not.toHaveBeenCalled();
        });
    });
});

// End of unit tests for: doForgotPassword
