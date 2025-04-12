import { BlockTag } from '@ethersproject/abstract-provider';
import { EvmManager } from './EvmManager';
import { ChainId } from './Types';
import { ethers } from 'ethers';
import { FeeEventsManager } from '../services/managers/FeeEventsManager';

export class PolygonManager extends EvmManager {

    kMinBlock = 61500000;

    constructor() {
        const chainId = ChainId.POLYGON;
        const contractAddress = '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9';
        const rpc = process.env.POLYGON_RPC!;

        super(chainId, contractAddress, rpc);
    }

    /**
     * For a given block range all `FeesCollected` events are loaded from the Polygon FeeCollector
     * @param fromBlock
     * @param toBlock
     */
    async loadFeeCollectorEvents(fromBlock: BlockTag, toBlock: BlockTag): Promise<ethers.Event[]> {
        const parsedEvents = await super.loadFeeCollectorEvents(fromBlock, toBlock);
        await FeeEventsManager.createFromEvents(this.chainId, this.parseFeeCollectorEvents(parsedEvents));
        return parsedEvents;
    }

}