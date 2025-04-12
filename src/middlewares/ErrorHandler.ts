import express from 'express';
import { CustomError } from '../errors/CustomError';
import { ErrorResponse } from '../responses/ErrorResponse';

/**
 * Middleware to handle errors in the application.
 * It captures errors thrown in the application and sends a structured response.
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const errorHandler = (
    err: Error, 
    req: express.Request, 
    res: express.Response, 
    next: express.NextFunction
) => {
    let response: ErrorResponse;

    if (err instanceof CustomError) {
        response = new ErrorResponse(err.serializeErrors());
        res.status(err.statusCode).send(JSON.stringify(response));
    }

    if (err.name === 'UnauthorizedError' || err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError'){
        if (err.message === 'jwt expired'){
            response = new ErrorResponse([{ code:112, message: 'Access token expired' }]);
        }
        else{
            response = new ErrorResponse([{ code:111, message: 'Unauthorized' }]);
        }
        res.status(401).send(JSON.stringify(response));
    }

    response = new ErrorResponse([{ message: err.message }]);
    res.status(500).send(JSON.stringify(response));
};