/**
* CustomError class
* Custom error class for handling errors in the application.
* Extends the built-in Error class and includes a status code and serialization method.
*/
export abstract class CustomError extends Error {
    abstract statusCode: number;
    
    constructor(message: string) {
        super(message);

        
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): {message: string, field?: string}[];
}