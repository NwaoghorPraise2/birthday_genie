// Unit tests for: doLogout

import {AuthRepository} from '../../src/repositories/authRepository';
import {AuthService} from '../../src/services/authService';

jest.mock('../../repositories/authRepository');

describe('AuthService.doLogout() doLogout method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy paths', () => {
        it('should successfully logout a user by clearing their refresh token', async () => {
            // Arrange
            const userId = 'user123';
            const updateRefreshTokenMock = jest.spyOn(AuthRepository, 'updateRefreshToken').mockResolvedValueOnce(undefined);

            // Act
            await AuthService.doLogout(userId);

            // Assert
            expect(updateRefreshTokenMock).toHaveBeenCalledWith(userId, null);
            expect(updateRefreshTokenMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Edge cases', () => {
        it('should handle the case where userId is an empty string', async () => {
            // Arrange
            const userId = '';
            const updateRefreshTokenMock = jest.spyOn(AuthRepository, 'updateRefreshToken').mockResolvedValueOnce(undefined);

            // Act
            await AuthService.doLogout(userId);

            // Assert
            expect(updateRefreshTokenMock).toHaveBeenCalledWith(userId, null);
            expect(updateRefreshTokenMock).toHaveBeenCalledTimes(1);
        });

        it('should handle the case where userId is null', async () => {
            // Arrange
            const userId = null as unknown as string;
            const updateRefreshTokenMock = jest.spyOn(AuthRepository, 'updateRefreshToken').mockResolvedValueOnce(undefined);

            // Act
            await AuthService.doLogout(userId);

            // Assert
            expect(updateRefreshTokenMock).toHaveBeenCalledWith(userId, null);
            expect(updateRefreshTokenMock).toHaveBeenCalledTimes(1);
        });

        it('should handle the case where userId is undefined', async () => {
            // Arrange
            const userId = undefined as unknown as string;
            const updateRefreshTokenMock = jest.spyOn(AuthRepository, 'updateRefreshToken').mockResolvedValueOnce(undefined);

            // Act
            await AuthService.doLogout(userId);

            // Assert
            expect(updateRefreshTokenMock).toHaveBeenCalledWith(userId, null);
            expect(updateRefreshTokenMock).toHaveBeenCalledTimes(1);
        });
    });
});

// End of unit tests for: doLogout
