// Unit tests for: validateRequest

import {NextFunction, Request, Response} from 'express';
import {ZodError} from 'zod';
import GlobalError from '../../utils/HttpsErrors';
import Validator from '../validator';

// Mock interfaces
interface MockRequestValidator {
    body?: {parseAsync: jest.Mock};
    params?: {parseAsync: jest.Mock};
    query?: {parseAsync: jest.Mock};
}

// Mock Express.js request, response, and next function
const mockRequest = () =>
    ({
        body: {},
        params: {},
        query: {}
    }) as Request;

const mockResponse = () =>
    ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }) as Response;

const mockNextFunction = jest.fn() as NextFunction;

describe('Validator.validateRequest() validateRequest method', () => {
    let mockValidator: MockRequestValidator;
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNextFunction;
        mockValidator = {
            body: {parseAsync: jest.fn()},
            params: {parseAsync: jest.fn()},
            query: {parseAsync: jest.fn()}
        };
    });

    // Happy Path Tests
    it('should validate request body successfully', async () => {
        // Arrange
        const validBody = {key: 'value'};
        req.body = validBody;
        mockValidator.body!.parseAsync.mockResolvedValue(validBody as any as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(mockValidator.body!.parseAsync).toHaveBeenCalledWith(validBody);
        expect(next).toHaveBeenCalled();
    });

    it('should validate request params successfully', async () => {
        // Arrange
        const validParams = {id: '123'};
        req.params = validParams;
        mockValidator.params!.parseAsync.mockResolvedValue(validParams as any as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(mockValidator.params!.parseAsync).toHaveBeenCalledWith(validParams);
        expect(next).toHaveBeenCalled();
    });

    it('should validate request query successfully', async () => {
        // Arrange
        const validQuery = {search: 'test'};
        req.query = validQuery;
        mockValidator.query!.parseAsync.mockResolvedValue(validQuery as any as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(mockValidator.query!.parseAsync).toHaveBeenCalledWith(validQuery);
        expect(next).toHaveBeenCalled();
    });

    // Edge Case Tests
    it('should handle ZodError for invalid body', async () => {
        // Arrange
        const zodError = new ZodError([]);
        mockValidator.body!.parseAsync.mockRejectedValue(zodError as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(GlobalError));
    });

    it('should handle ZodError for invalid params', async () => {
        // Arrange
        const zodError = new ZodError([]);
        mockValidator.params!.parseAsync.mockRejectedValue(zodError as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(GlobalError));
    });

    it('should handle ZodError for invalid query', async () => {
        // Arrange
        const zodError = new ZodError([]);
        mockValidator.query!.parseAsync.mockRejectedValue(zodError as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(GlobalError));
    });

    it('should pass non-ZodError to next', async () => {
        // Arrange
        const error = new Error('Unexpected error');
        mockValidator.body!.parseAsync.mockRejectedValue(error as never);

        // Act
        await Validator.validateRequest(mockValidator as any)(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(error);
    });
});

// End of unit tests for: validateRequest
