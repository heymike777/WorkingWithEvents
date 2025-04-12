import { ParsedFeeCollectedEvents } from "../../chains/EvmManager";
import { PolygonManager } from "../../chains/PolygonManager";
import { ChainId } from "../../chains/Types";
import { FeeBlock } from "../../entities/FeeBlock";
import { FeeEvent } from "../../entities/FeeEvent";

/**
 * Class to manage fee events.
 */
export class FeeEventsManager {

    /**
     * Create a fee event from a parsed fee collected event.
     * @param chainId The chain ID.
     * @param blockId The block ID.
     * @param event The parsed fee collected event.
     */
    static async createFromEvent(chainId: ChainId, event: ParsedFeeCollectedEvents) {
        // Check if the event already exists
        const existingEvent = await FeeEvent.findOne({
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
        });
        if (existingEvent) {
            // Event already exists, no need to create a new one
            return existingEvent;
        }

        // Create a new fee event
        try {
            const feeEvent = await FeeEvent.create({
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                chainId: chainId,
                token: event.token,
                integrator: event.integrator,
                integratorFee: event.integratorFee.toString(),
                lifiFee: event.lifiFee.toString(),
                createdAt: new Date(),
            });
            return feeEvent;    
        }
        catch (error) {
            // Handle the error if needed
            console.error('Error creating fee event:', error);
            return undefined;
        }
    }
    /**
     * Create fee events from a list of parsed fee collected events.
     * @param chainId The chain ID.
     * @param blockId The block ID.
     * @param events The list of parsed fee collected events.
     */
    static async createFromEvents(chainId: ChainId, events: ParsedFeeCollectedEvents[]) {
        for (const event of events) {
            await FeeEventsManager.createFromEvent(chainId, event);            
        }
    }

    /**
     * Get a block.
     * @param chainId The chain ID.
     * @param blockNumber The block number.
     */
    static async getBlock(chainId: ChainId, blockNumber: number) {
        const block = await FeeBlock.findOne({ chainId, blockNumber });
        return block || undefined;
    }

    /**
     * Create a fee block.
     * @param chainId The chain ID.
     * @param blockNumber The block number.
     * @param eventsCount The number of events in the block.
     */
    static async createBlock(chainId: ChainId, blockNumber: number, eventsCount: number) {
        try {
            const block = await FeeBlock.create({
                blockNumber,
                eventsCount,
                chainId,
                createdAt: new Date(),
            });
            return block;    
        }
        catch (error) {
            // Handle the error if needed
            console.error('Error creating fee block:', error);
            return undefined;
        }
    }

    /**
     * Load blocks from the database or on-chain if not found.
     * @param chainId The chain ID.
     * @param fromBlock The starting block number.
     * @param toBlock The ending block number.
     */
    static async loadBlocks(chainId: ChainId, fromBlock: number, toBlock: number) {
        const blocks = await FeeBlock.find({
            chainId,
            blockNumber: { $gte: fromBlock, $lte: toBlock },
        });

        const nonExistentBlocks = [];
        for (let i = fromBlock; i <= toBlock; i++) {
            const block = blocks.find(b => b.blockNumber === i);
            if (!block) {
                nonExistentBlocks.push(i);
            }
        }
        if (nonExistentBlocks.length > 0) {
            console.log(`Blocks not found in DB: ${nonExistentBlocks}`);

            for (const blockNumber of nonExistentBlocks) {
                if (chainId == ChainId.POLYGON){
                    const polygonManager = new PolygonManager();
                    const events = await polygonManager.loadFeeCollectorEvents(blockNumber, blockNumber);
                    const parsedEvents = polygonManager.parseFeeCollectorEvents(events);
                    await FeeEventsManager.createFromEvents(chainId, parsedEvents);
                    await FeeEventsManager.createBlock(chainId, blockNumber, parsedEvents.length);
                }
                else {
                    console.log(`No manager for chainId ${chainId}`);
                }
                
            }

        }

        return blocks;
    }

}