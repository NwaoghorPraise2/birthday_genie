// Unit tests for: dogetOAuthRequestURL

import responseMessage from '../../src/constant/responseMessage';
import GlobalError from '../../src/utils/HttpsErrors';
import JWTService from '../../src/utils/jwt';
import {AuthService} from '../../src/services/authService';

// src/services/__tests__/authService.test.ts
// Mocking the JWTService to control its behavior during tests
jest.mock('../../../utils/jwt', () => ({
    getInstance: jest.fn().mockReturnValue({
        getOAuthClient: jest.fn().mockReturnValue({
            generateAuthUrl: jest.fn().mockReturnValue('https://example.com/oauth2/auth')
        })
    })
}));

describe('AuthService.dogetOAuthRequestURL() dogetOAuthRequestURL method', () => {
    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return a valid OAuth request URL', () => {
            // Arrange
            const expectedUrl = 'https://example.com/oauth2/auth';

            // Act
            const result = AuthService.dogetOAuthRequestURL();

            // Assert
            expect(result).toBe(expectedUrl);
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should throw an error if the authorization URL is not generated', () => {
            // Arrange
            const mockOAuthClient = {
                generateAuthUrl: jest.fn().mockReturnValue(null)
            };
            (JWTService.getInstance().getOAuthClient as jest.Mock).mockReturnValue(mockOAuthClient);

            // Act & Assert
            expect(() => AuthService.dogetOAuthRequestURL()).toThrow(new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG));
        });

        it('should handle unexpected errors gracefully', () => {
            // Arrange
            const mockOAuthClient = {
                generateAuthUrl: jest.fn().mockImplementation(() => {
                    throw new Error('Unexpected error');
                })
            };
            (JWTService.getInstance().getOAuthClient as jest.Mock).mockReturnValue(mockOAuthClient);

            // Act & Assert
            expect(() => AuthService.dogetOAuthRequestURL()).toThrow(new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG));
        });
    });
});

// End of unit tests for: dogetOAuthRequestURL
