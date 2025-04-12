import { CustomError } from './CustomError';

/**
 * NotFoundError class
 * This class extends the CustomError class and represents a 404 Not Found error.
 * It is used to indicate that a requested resource could not be found.
 */
export class NotFoundError extends CustomError {
    statusCode = 404;
    reason = 'Not found';

    constructor() {
        super('Route not found');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}