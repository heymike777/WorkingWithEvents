import mongoose from "mongoose";
import { ChainId } from "../chains/Types";
import { IFeeBlock } from "../entities/FeeBlock";
import { FeeEventsManager } from "../services/managers/FeeEventsManager";
import '../services/helpers/Secrets'
import { FeeEvent, IFeeEvent } from "../entities/FeeEvent";

describe('Fetch block 70196524', () => {
    let blocks: IFeeBlock[];

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_CONNECTION_URL!);
        blocks = await FeeEventsManager.loadBlocks(ChainId.POLYGON, 70196524, 70196524);
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    it('blocks count', () => {
        expect(blocks.length).toBe(1);
    });

    it('events count', () => {
        expect(blocks[0].eventsCount).toBe(1);
    });
});

describe('Fetch fee events integrator 0x1Bcc58D165e5374D7B492B21c0a572Fd61C0C2a0', () => {
    let events: IFeeEvent[];
    const integrator = '0x1Bcc58D165e5374D7B492B21c0a572Fd61C0C2a0';

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_CONNECTION_URL!);
        events = await FeeEvent.find({ integrator: integrator });
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    it('events count > 0', () => {
        expect(events.length).toBeGreaterThan(0);
    });
});

