import { BigNumber, ethers } from 'ethers' // please use ethers v5 to ensure compatibility
import { FeeCollector__factory } from 'lifi-contract-typings'
import { BlockTag } from '@ethersproject/abstract-provider';
import { ChainId } from './Types';

export interface ParsedFeeCollectedEvents {
    token: string; // the address of the token that was collected
    integrator: string; // the integrator that triggered the fee collection
    integratorFee: BigNumber; // the share collector for the integrator
    lifiFee: BigNumber; // the share collected for lifi
}

export class EvmManager{

    chainId: ChainId;
    contractAddress: string;
    rpc: string;

    constructor(chainId: ChainId, contractAddress: string, rpc: string) {
        this.chainId = chainId;
        this.contractAddress = contractAddress;
        this.rpc = rpc;
    }
 
    /**
     * For a given block range all `FeesCollected` events are loaded from the Polygon FeeCollector
     * @param fromBlock
     * @param toBlock
     */
    async loadFeeCollectorEvents(fromBlock: BlockTag, toBlock: BlockTag): Promise<ethers.Event[]> {
        const feeCollector = new ethers.Contract(
            this.contractAddress,
            FeeCollector__factory.createInterface(),
            new ethers.providers.JsonRpcProvider(this.rpc)
        );
        const filter = feeCollector.filters.FeesCollected();
        return feeCollector.queryFilter(filter, fromBlock, toBlock);
    }

    /**
     * Takes a list of raw events and parses them into ParsedFeeCollectedEvents
     * @param events
     */
    parseFeeCollectorEvents(events: ethers.Event[]): ParsedFeeCollectedEvents[] {
        const feeCollectorContract = new ethers.Contract(
            this.contractAddress,
            FeeCollector__factory.createInterface(),
            new ethers.providers.JsonRpcProvider(this.rpc)
        );
    
        return events.map(event => {
            const parsedEvent = feeCollectorContract.interface.parseLog(event);
        
            const feesCollected: ParsedFeeCollectedEvents = {
                token: parsedEvent.args[0],
                integrator: parsedEvent.args[1],
                integratorFee: BigNumber.from(parsedEvent.args[2]),
                lifiFee: BigNumber.from(parsedEvent.args[3]),
            };
            return feesCollected;
        })
    }

}