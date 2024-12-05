// Unit tests for: doUserRegistration

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import {IUser} from '../../src/types/auth.types';
import HashingService from '../../src/utils/hash';
import GlobalError from '../../src/utils/HttpsErrors';
import JWTService from '../../src/utils/jwt';
import emailEmitter from '../../src/utils/mail/emitter';
import generateTokens from '../../src/utils/tokenGenerator';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/jwt');
jest.mock('../../utils/mail/emitter');
jest.mock('../../utils/tokenGenerator');
jest.mock('../../utils/hash');

describe('AuthService.doUserRegistration() doUserRegistration method', () => {
    const mockUser: IUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy Paths', () => {
        it('should register a new user successfully', async () => {
            // Arrange
            (AuthRepository.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null);
            (HashingService.doHashing as jest.Mock).mockResolvedValue('hashedPassword');
            (generateTokens as any).verificationToken = 'verificationToken';
            (generateTokens as any).verificationTokenExpiresAt = new Date();
            (AuthRepository.createUser as jest.Mock).mockResolvedValue({...mockUser, id: 'userId'});
            (JWTService.getInstance().signAccessToken as jest.Mock).mockReturnValue('accessToken');
            (JWTService.getInstance().signRefreshToken as jest.Mock).mockReturnValue('refreshToken');

            // Act
            const result = await AuthService.doUserRegistration(mockUser);

            // Assert
            expect(result).toHaveProperty('access_token', 'accessToken');
            expect(result).toHaveProperty('refresh_token', 'refreshToken');
            expect(result.result).toHaveProperty('id', 'userId');
            expect(emailEmitter.emit).toHaveBeenCalledWith(
                'Verification-Email',
                expect.objectContaining({
                    email: mockUser.email,
                    name: mockUser.username,
                    verificationToken: 'verificationToken'
                })
            );
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if the user already exists', async () => {
            // Arrange
            (AuthRepository.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(mockUser);

            // Act & Assert
            await expect(AuthService.doUserRegistration(mockUser)).rejects.toThrow(GlobalError);
            await expect(AuthService.doUserRegistration(mockUser)).rejects.toThrow(responseMessage.USER_ALREADY_EXISTS);
        });

        it('should throw an error if user creation fails', async () => {
            // Arrange
            (AuthRepository.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null);
            (HashingService.doHashing as jest.Mock).mockResolvedValue('hashedPassword');
            (generateTokens as any).verificationToken = 'verificationToken';
            (generateTokens as any).verificationTokenExpiresAt = new Date();
            (AuthRepository.createUser as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.doUserRegistration(mockUser)).rejects.toThrow(GlobalError);
            await expect(AuthService.doUserRegistration(mockUser)).rejects.toThrow(responseMessage.SOMETHING_WENT_WRONG);
        });
    });
});

// End of unit tests for: doUserRegistration
