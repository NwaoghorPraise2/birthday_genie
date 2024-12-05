// Unit tests for: verifyEmail

import responseMessage from '../src/constant/responseMessage';
import {AuthRepository} from '../src/repositories/authRepository';
import {IUser} from '../src/types/auth.types';
import GlobalError from '../src/utils/HttpsErrors';
import emailEmitter from '../src/utils/mail/emitter';
import {AuthService} from '../src/services/authService';

jest.mock('../../repositories/authRepository');
jest.mock('../../utils/mail/emitter');

describe('AuthService.verifyEmail() verifyEmail method', () => {
    const mockUser: IUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        isVerified: false,
        verificationToken: 'validToken',
        verificationTokenExpiresAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path Tests
    it('should verify the user and emit a welcome email when a valid token is provided', async () => {
        // Arrange
        (AuthRepository.getUserByVerificationToken as jest.Mock).mockResolvedValue(mockUser);
        (AuthRepository.verifyUser as jest.Mock).mockResolvedValue(true);

        // Act
        const result = await AuthService.verifyEmail('validToken');

        // Assert
        expect(result).toEqual(expect.objectContaining({id: '123', isVerified: true}));
        expect(AuthRepository.verifyUser).toHaveBeenCalledWith('123', true, undefined, undefined);
        expect(emailEmitter.emit).toHaveBeenCalledWith('Welcome-Email', {
            email: 'test@example.com',
            name: 'testuser'
        });
    });

    // Edge Case Tests
    it('should throw an error if the token is expired or invalid', async () => {
        // Arrange
        (AuthRepository.getUserByVerificationToken as jest.Mock).mockResolvedValue(null);

        // Act & Assert
        await expect(AuthService.verifyEmail('invalidToken')).rejects.toThrow(
            new GlobalError(400, responseMessage.NOT_FOUND('Expired Token or Verification Token'))
        );
    });

    it('should throw an error if the user is already verified', async () => {
        // Arrange
        const verifiedUser = {...mockUser, isVerified: true};
        (AuthRepository.getUserByVerificationToken as jest.Mock).mockResolvedValue(verifiedUser);

        // Act & Assert
        await expect(AuthService.verifyEmail('validToken')).rejects.toThrow(new GlobalError(400, responseMessage.ALREADY_VERIFIED));
    });
});

// End of unit tests for: verifyEmail
