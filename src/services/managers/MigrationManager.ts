import { FeeEvent } from "../../entities/FeeEvent";

/**
 * Class to manage migrations.
 */
export class MigrationManager {

    /**
     * Sync indexes for all entities.
     */
    static async syncIndexes() {
        await FeeEvent.syncIndexes();
    }

}