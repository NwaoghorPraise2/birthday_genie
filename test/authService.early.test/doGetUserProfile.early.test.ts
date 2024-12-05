// Unit tests for: doGetUserProfile

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import {IUser} from '../../src/types/auth.types';
import GlobalError from '../../src/utils/HttpsErrors';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');

describe('AuthService.doGetUserProfile() doGetUserProfile method', () => {
    const mockUser: IUser = {
        id: '123',
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should return user profile when user exists', async () => {
            // Arrange: Mock the repository to return a user
            (AuthRepository.getUserById as jest.Mock).mockResolvedValue(mockUser);

            // Act: Call the method
            const result = await AuthService.doGetUserProfile('123');

            // Assert: Verify the result
            expect(result).toEqual(mockUser);
            expect(AuthRepository.getUserById).toHaveBeenCalledWith('123');
        });
    });

    describe('Edge cases', () => {
        it('should throw a GlobalError with 400 status when user does not exist', async () => {
            // Arrange: Mock the repository to return null
            (AuthRepository.getUserById as jest.Mock).mockResolvedValue(null);

            // Act & Assert: Call the method and expect an error
            await expect(AuthService.doGetUserProfile('nonexistent-id')).rejects.toThrow(
                new GlobalError(400, responseMessage.NOT_FOUND('User with nonexistent-id '))
            );
            expect(AuthRepository.getUserById).toHaveBeenCalledWith('nonexistent-id');
        });

        it('should handle unexpected errors gracefully', async () => {
            // Arrange: Mock the repository to throw an error
            (AuthRepository.getUserById as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            // Act & Assert: Call the method and expect an error
            await expect(AuthService.doGetUserProfile('123')).rejects.toThrow('Unexpected error');
            expect(AuthRepository.getUserById).toHaveBeenCalledWith('123');
        });
    });
});

// End of unit tests for: doGetUserProfile
