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

// app.use(authRouter);

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

    const polygon = new PolygonManager();
    const events = await polygon.loadFeeCollectorEvents(70196523, 70196525);
    const parsedEvents = polygon.parseFeeCollectorEvents(events);
    console.log('Parsed events', parsedEvents);
}

start();