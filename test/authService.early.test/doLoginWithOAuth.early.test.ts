// Unit tests for: doLoginWithOAuth

import config from '../../src/config/config';
import responseMessage from '../../src/constant/responseMessage';
import {AuthRepository} from '../../src/repositories/authRepository';
import {GoogleUserData} from '../../src/types/auth.types';
import GlobalError from '../../src/utils/HttpsErrors';
import JWTService from '../../src/utils/jwt';
import {AuthService} from '../../src/services/authService';

// Mock dependencies
jest.mock('../../repositories/authRepository');
jest.mock('../../utils/jwt');
jest.mock('../../utils/logger');
jest.mock('../../config/config', () => ({
    ClIENT_URL: 'http://localhost:3000'
}));

describe('AuthService.doLoginWithOAuth() doLoginWithOAuth method', () => {
    const mockOAuthClient = {
        getToken: jest.fn(),
        setCredentials: jest.fn(),
        credentials: {access_token: 'mockAccessToken'}
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (JWTService.getInstance as jest.Mock).mockReturnValue({
            getOAuthClient: jest.fn().mockReturnValue(mockOAuthClient)
        });
    });

    describe('Happy paths', () => {
        it('should successfully login with OAuth and return tokens and user data', async () => {
            // Arrange
            const mockCode = 'mockCode';
            const mockTokens = {access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken'};
            const mockUserData: GoogleUserData = {
                email: 'test@example.com',
                name: 'Test User',
                picture: 'http://example.com/picture.jpg',
                sub: 'mockSub',
                given_name: 'Test',
                family_name: 'User',
                email_verified: true
            };
            const mockUser = {id: 'mockUserId', ...mockUserData};

            mockOAuthClient.getToken.mockResolvedValue({tokens: mockTokens});
            (AuthService as any).getOAuthUserData = jest.fn().mockResolvedValue(mockUserData);
            (AuthRepository.upSertUser as jest.Mock).mockResolvedValue(mockUser);
            (AuthService as any).generateAcccesAndRefreshToken = jest.fn().mockResolvedValue(mockTokens);

            // Act
            const result = await AuthService.doLoginWithOAuth(mockCode);

            // Assert
            expect(result).toEqual({
                access_token: mockTokens.access_token,
                refresh_token: mockTokens.refresh_token,
                user: mockUser,
                redirectUrl: config.ClIENT_URL
            });
            expect(mockOAuthClient.getToken).toHaveBeenCalledWith(mockCode);
            expect(AuthService.getOAuthUserData).toHaveBeenCalledWith(mockTokens.access_token);
            expect(AuthRepository.upSertUser).toHaveBeenCalledWith(
                mockUserData.email,
                `${mockUserData.family_name} ${mockUserData.given_name}`,
                mockUserData.sub,
                mockUserData.email_verified,
                mockUserData.name,
                mockUserData.picture
            );
        });
    });

    describe('Edge cases', () => {
        it('should throw an error if tokens are not retrieved', async () => {
            // Arrange
            const mockCode = 'mockCode';
            mockOAuthClient.getToken.mockResolvedValue({tokens: null});

            // Act & Assert
            await expect(AuthService.doLoginWithOAuth(mockCode)).rejects.toThrow(new GlobalError(404, responseMessage.NOT_FOUND('Tokens')));
        });

        it('should throw an error if user data is not retrieved', async () => {
            // Arrange
            const mockCode = 'mockCode';
            const mockTokens = {access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken'};

            mockOAuthClient.getToken.mockResolvedValue({tokens: mockTokens});
            (AuthService as any).getOAuthUserData = jest.fn().mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.doLoginWithOAuth(mockCode)).rejects.toThrow(new GlobalError(404, responseMessage.NOT_FOUND('User Data')));
        });
    });
});

// End of unit tests for: doLoginWithOAuth
