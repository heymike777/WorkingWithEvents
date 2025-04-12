import { ParsedFeeCollectedEvents } from "../../chains/EvmManager";
import { ChainId } from "../../chains/Types";
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

}