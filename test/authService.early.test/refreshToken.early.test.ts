// Unit tests for: refreshToken

import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import HashingService from '../../src/utils/hash';
import GlobalError from '../../src/utils/HttpsErrors';
import JWTService from '../../src/utils/jwt';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/jwt');
jest.mock('../../utils/hash');

describe('AuthService.refreshToken() refreshToken method', () => {
    const mockUserId = 'user123';
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const mockDecodedToken = {id: mockUserId};
    const mockUser = {id: mockUserId, refreshToken: 'hashedRefreshToken'};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should return new access and refresh tokens when provided a valid refresh token', async () => {
            // Arrange
            JWTService.getInstance().verifyRefreshToken.mockReturnValue(mockDecodedToken);
            AuthRepository.getUserByIdWithRefreshToken.mockResolvedValue(mockUser);
            HashingService.verifyHashEntity.mockResolvedValue(true);
            AuthService.generateAcccesAndRefreshToken = jest.fn().mockResolvedValue({
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken
            });

            // Act
            const result = await AuthService.refreshToken(mockRefreshToken);

            // Assert
            expect(result).toEqual({
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
                userId: mockUserId
            });
            expect(JWTService.getInstance().verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
            expect(AuthRepository.getUserByIdWithRefreshToken).toHaveBeenCalledWith(mockUserId);
            expect(HashingService.verifyHashEntity).toHaveBeenCalledWith(mockRefreshToken, mockUser.refreshToken);
            expect(AuthService.generateAcccesAndRefreshToken).toHaveBeenCalledWith({id: mockUserId});
        });
    });

    describe('Edge cases', () => {
        it('should throw an error if refresh token is not provided', async () => {
            // Arrange
            const invalidToken = '';

            // Act & Assert
            await expect(AuthService.refreshToken(invalidToken)).rejects.toThrow(new GlobalError(400, responseMessage.NOT_FOUND('Refresh Token')));
        });

        it('should throw an error if refresh token is invalid', async () => {
            // Arrange
            JWTService.getInstance().verifyRefreshToken.mockImplementation(() => {
                throw new GlobalError(401, responseMessage.INVALID_TOKEN);
            });

            // Act & Assert
            await expect(AuthService.refreshToken(mockRefreshToken)).rejects.toThrow(new GlobalError(401, responseMessage.INVALID_TOKEN));
        });

        it('should throw an error if user is not found with the decoded token id', async () => {
            // Arrange
            JWTService.getInstance().verifyRefreshToken.mockReturnValue(mockDecodedToken);
            AuthRepository.getUserByIdWithRefreshToken.mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.refreshToken(mockRefreshToken)).rejects.toThrow(
                new GlobalError(400, responseMessage.NOT_FOUND(`User with ${mockRefreshToken} `))
            );
        });

        it('should throw an error if refresh token does not match the stored hash', async () => {
            // Arrange
            JWTService.getInstance().verifyRefreshToken.mockReturnValue(mockDecodedToken);
            AuthRepository.getUserByIdWithRefreshToken.mockResolvedValue(mockUser);
            HashingService.verifyHashEntity.mockResolvedValue(false);

            // Act & Assert
            await expect(AuthService.refreshToken(mockRefreshToken)).rejects.toThrow(new GlobalError(401, responseMessage.INVALID_TOKEN));
        });
    });
});

// End of unit tests for: refreshToken
