import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import 'reflect-metadata';
import cors, { CorsOptions } from 'cors';
import mongoose from 'mongoose';

import './services/helpers/Secrets'
import { NotFoundError } from './errors/NotFoundError';
import { errorHandler } from './middlewares/ErrorHandler';
import { PolygonManager } from './chains/PolygonManager';
import { MigrationManager } from './services/managers/MigrationManager';
import minimist from 'minimist';
import { FeeEventsManager } from './services/managers/FeeEventsManager';
import { eventsRouter } from './routes/v1/Events';
import { IFeeBlock } from './entities/FeeBlock';

const corsOptions: CorsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 204,
}

const app = express();
app.use(json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api/v1/events', eventsRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    console.log('MongoDB - connecting');
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL!);
    console.log('MongoDB - connected');

    const port = process.env.PORT;
    app.listen(port, () => {
        onExpressStarted();
    });
}

/**
 * Function to be called when the Express server has started.
 */
const onExpressStarted = async () => {
    console.log('Express - started');

    const args = minimist(process.argv.slice(2));
    if (args['from'] && args['to']) {
        let fromBlock = parseInt(args['from']);
        const toBlock = parseInt(args['to']);
        console.log('fromBlock', fromBlock, 'toBlock', toBlock);

        const polygon = new PolygonManager();
        if (fromBlock < polygon.kMinBlock) {
            fromBlock = polygon.kMinBlock;
            console.error(`fromBlock is less than the minimum block number. Setting fromBlock to ${polygon.kMinBlock}`);
        }

        // Load blocks from the database or on-chain if not found
        const blocks: IFeeBlock[] = await FeeEventsManager.loadBlocks(polygon.chainId, fromBlock, toBlock);
        console.log('Blocks:', blocks);
    }

    // await MigrationManager.syncIndexes();
}

start();