import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

/**
 * Class representing a request validation error.
 * @extends CustomError
 */
export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super('Invalid request params');

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg }
        });
    }
}