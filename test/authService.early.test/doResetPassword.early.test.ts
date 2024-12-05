// Unit tests for: doResetPassword

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import HashingService from '../../src/utils/hash';
import GlobalError from '../../src/utils/HttpsErrors';
import emailEmitter from '../../src/utils/mail/emitter';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/mail/emitter');
jest.mock('../../utils/hash');

describe('AuthService.doResetPassword() doResetPassword method', () => {
    const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        resetPasswordToken: 'validToken'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should reset the password successfully when provided with a valid token', async () => {
            // Arrange
            const newPassword = 'newSecurePassword';
            (AuthRepository.getUserByResetPasswordToken as jest.Mock).mockResolvedValue(mockUser);
            (HashingService.doHashing as jest.Mock).mockResolvedValue('hashedNewPassword');

            // Act
            await AuthService.doResetPassword('validToken', newPassword);

            // Assert
            expect(AuthRepository.getUserByResetPasswordToken).toHaveBeenCalledWith('validToken');
            expect(HashingService.doHashing).toHaveBeenCalledWith(newPassword);
            expect(AuthRepository.updatePassword).toHaveBeenCalledWith(mockUser.id, 'hashedNewPassword');
            expect(AuthRepository.updateResetPasswordToken).toHaveBeenCalledWith(mockUser.id, null, null);
            expect(emailEmitter.emit).toHaveBeenCalledWith('Reset-Password-Success-Email', {
                email: mockUser.email,
                name: mockUser.username
            });
        });
    });

    describe('Edge cases', () => {
        it('should throw an error if the token is invalid or expired', async () => {
            // Arrange
            (AuthRepository.getUserByResetPasswordToken as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.doResetPassword('invalidToken', 'newPassword')).rejects.toThrow(
                new GlobalError(400, responseMessage.NOT_FOUND('Expired Token or Invalid Token'))
            );

            expect(AuthRepository.getUserByResetPasswordToken).toHaveBeenCalledWith('invalidToken');
            expect(HashingService.doHashing).not.toHaveBeenCalled();
            expect(AuthRepository.updatePassword).not.toHaveBeenCalled();
            expect(AuthRepository.updateResetPasswordToken).not.toHaveBeenCalled();
            expect(emailEmitter.emit).not.toHaveBeenCalled();
        });

        it('should handle hashing service failure gracefully', async () => {
            // Arrange
            const newPassword = 'newSecurePassword';
            (AuthRepository.getUserByResetPasswordToken as jest.Mock).mockResolvedValue(mockUser);
            (HashingService.doHashing as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

            // Act & Assert
            await expect(AuthService.doResetPassword('validToken', newPassword)).rejects.toThrow('Hashing failed');

            expect(AuthRepository.getUserByResetPasswordToken).toHaveBeenCalledWith('validToken');
            expect(HashingService.doHashing).toHaveBeenCalledWith(newPassword);
            expect(AuthRepository.updatePassword).not.toHaveBeenCalled();
            expect(AuthRepository.updateResetPasswordToken).not.toHaveBeenCalled();
            expect(emailEmitter.emit).not.toHaveBeenCalled();
        });
    });
});

// End of unit tests for: doResetPassword
