import { EvmManager } from './EvmManager';
import { ChainId } from './Types';

export class PolygonManager extends EvmManager {

    constructor() {
        const chainId = ChainId.POLYGON;
        const contractAddress = '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9';
        const rpc = process.env.POLYGON_RPC!;

        super(chainId, contractAddress, rpc);
    }

}