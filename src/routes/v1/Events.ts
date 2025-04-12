import express, { Request, Response } from "express";
import { FeeEvent } from "../../entities/FeeEvent";
import { query } from "express-validator";
import { validateRequest } from "../../middlewares/ValidateRequest";

const router = express.Router();

/**
 * Route to get events.
 * This route is used to get events from the database.
 * @param {string} integrator - The integrator to filter events by.
 * @param {number} pageSize - The number of events to return per page.
 * @param {number} page - The page number to return.
 * @returns {object} - An object containing the events.
 */
router.get(
    '/api/v1/events',
    [
        query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('pageSize must be a number between 1 and 100'),
        query('page').optional().isInt({ min: 1 }).withMessage('page must be a number greater than 0'),
        query('integrator').notEmpty().withMessage('integrator must be valid'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
		const integrator = '' + req.query.integrator;
        const pageSize = req.query.pageSize ? parseInt('' + req.query.pageSize) : 20;
        const page = req.query.page ? parseInt('' + req.query.page) : 1;
        const skip = pageSize * (page - 1);
        const limit = pageSize;
        console.log('pageSize', pageSize, 'page', page, 'skip', skip, 'limit', limit);

        const events = await FeeEvent.find({
            integrator: integrator
        })
        .sort({ blockNumber: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

		const response = {
			events
		};
	
		res.status(200).send(response);
    }
);

export { router as eventsRouter };
