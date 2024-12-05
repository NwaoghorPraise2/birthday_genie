// Unit tests for: doLogin

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import {IUser, IUserLogin} from '../../src/types/auth.types';
import HashingService from '../../src/utils/hash';
import GlobalError from '../../src/utils/HttpsErrors';
import JWTService from '../../src/utils/jwt';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/hash');
jest.mock('../../utils/jwt');

describe('AuthService.doLogin() doLogin method', () => {
    const mockUser: IUser = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword'
    };

    const mockLoginData: IUserLogin = {
        email: 'test@example.com',
        password: 'password123'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path Tests
    it('should successfully login a user with valid credentials', async () => {
        // Arrange
        (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (HashingService.verifyHashEntity as jest.Mock).mockResolvedValue(true);
        (JWTService.getInstance().signAccessToken as jest.Mock).mockReturnValue('access_token');
        (JWTService.getInstance().signRefreshToken as jest.Mock).mockReturnValue('refresh_token');
        (AuthRepository.userWithoutPassword as jest.Mock).mockReturnValue(mockUser);

        // Act
        const result = await AuthService.doLogin(mockLoginData);

        // Assert
        expect(result).toEqual({
            access_token: 'access_token',
            refresh_token: 'refresh_token',
            result: mockUser
        });
    });

    // Edge Case Tests
    it('should throw an error if the user is not found', async () => {
        // Arrange
        (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

        // Act & Assert
        await expect(AuthService.doLogin(mockLoginData)).rejects.toThrow(
            new GlobalError(400, responseMessage.NOT_FOUND(`User with ${mockLoginData.email} `))
        );
    });

    it('should throw an error if the password is invalid', async () => {
        // Arrange
        (AuthRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (HashingService.verifyHashEntity as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(AuthService.doLogin(mockLoginData)).rejects.toThrow(new GlobalError(400, responseMessage.INVALID_CREDENTIALS));
    });

    it('should handle unexpected errors gracefully', async () => {
        // Arrange
        (AuthRepository.getUserByEmail as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

        // Act & Assert
        await expect(AuthService.doLogin(mockLoginData)).rejects.toThrow('Unexpected error');
    });
});

// End of unit tests for: doLogin
