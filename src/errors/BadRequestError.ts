import { CustomError } from "./CustomError";

/**
 * BadRequestError class
 * This class extends the CustomError class and represents a 400 Bad Request error.
 * It is used to indicate that the request was invalid or cannot be served.
 */
export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(message: string, private field?: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.message, field: this.field }
        ]
    }
}