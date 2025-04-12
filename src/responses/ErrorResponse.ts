/**
 * ErrorResponseItem interface
 * This interface is used to represent an individual error item in the error response.
 */
interface ErrorResponseItem {
    message: string;
    code?: number;
    field?: string;
}

/**
 * ErrorResponse class
 * This class is used to represent an error response in the application.
 * It contains an array of error items that describe the errors that occurred.
 */
export class ErrorResponse {    
    constructor(private errors:ErrorResponseItem[]) {
    }
}