// Unit tests for: doChangeUserPassword

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import {IUser} from '../../src/types/auth.types';
import HashingService from '../../src/utils/hash';
import GlobalError from '../../src/utils/HttpsErrors';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/hash');

describe('AuthService.doChangeUserPassword() doChangeUserPassword method', () => {
    const mockUserId = 'user123';
    const mockOldPassword = 'oldPassword';
    const mockNewPassword = 'newPassword';
    const mockHashedNewPassword = 'hashedNewPassword';
    const mockUser: IUser = {
        id: mockUserId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedOldPassword'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should change the user password successfully when old password is correct', async () => {
            // Arrange
            (AuthRepository.getUserByIdWithPassword as jest.Mock).mockResolvedValue(mockUser);
            (HashingService.verifyHashEntity as jest.Mock).mockResolvedValue(true);
            (HashingService.doHashing as jest.Mock).mockResolvedValue(mockHashedNewPassword);

            // Act
            await AuthService.doChangeUserPassword(mockUserId, mockOldPassword, mockNewPassword);

            // Assert
            expect(AuthRepository.getUserByIdWithPassword).toHaveBeenCalledWith(mockUserId);
            expect(HashingService.verifyHashEntity).toHaveBeenCalledWith(mockOldPassword, mockUser.password);
            expect(HashingService.doHashing).toHaveBeenCalledWith(mockNewPassword);
            expect(AuthRepository.updatePassword).toHaveBeenCalledWith(mockUserId, mockHashedNewPassword);
        });
    });

    describe('Edge cases', () => {
        it('should throw an error if the old password is incorrect', async () => {
            // Arrange
            (AuthRepository.getUserByIdWithPassword as jest.Mock).mockResolvedValue(mockUser);
            (HashingService.verifyHashEntity as jest.Mock).mockResolvedValue(false);

            // Act & Assert
            await expect(AuthService.doChangeUserPassword(mockUserId, mockOldPassword, mockNewPassword)).rejects.toThrow(
                new GlobalError(400, responseMessage.INVALID_CREDENTIALS)
            );

            expect(AuthRepository.getUserByIdWithPassword).toHaveBeenCalledWith(mockUserId);
            expect(HashingService.verifyHashEntity).toHaveBeenCalledWith(mockOldPassword, mockUser.password);
            expect(HashingService.doHashing).not.toHaveBeenCalled();
            expect(AuthRepository.updatePassword).not.toHaveBeenCalled();
        });

        it('should throw an error if the user is not found', async () => {
            // Arrange
            (AuthRepository.getUserByIdWithPassword as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.doChangeUserPassword(mockUserId, mockOldPassword, mockNewPassword)).rejects.toThrow(
                new GlobalError(400, responseMessage.NOT_FOUND(`User with ${mockUserId} `))
            );

            expect(AuthRepository.getUserByIdWithPassword).toHaveBeenCalledWith(mockUserId);
            expect(HashingService.verifyHashEntity).not.toHaveBeenCalled();
            expect(HashingService.doHashing).not.toHaveBeenCalled();
            expect(AuthRepository.updatePassword).not.toHaveBeenCalled();
        });
    });
});

// End of unit tests for: doChangeUserPassword
