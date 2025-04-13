import { Request, Response, NextFunction, response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/RequestValidationError';

/**
 * Middleware to validate request data using express-validator.
 * This middleware checks if the request data is valid according to the validation rules defined in the route handlers.
 * If the data is invalid, it throws a RequestValidationError with the validation errors.
 * If the data is valid, it calls the next middleware in the stack.
 * 
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    } 

    next();
};