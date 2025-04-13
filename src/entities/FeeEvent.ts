import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import { ChainId } from "../chains/Types";

@index({ chainId: 1, blockNumber: 1 })
@index({ integrator: 1, blockNumber: -1 })
@index({ chainId: 1, transactionHash: 1, blockNumber: 1 }, { unique: true }) //TBD: let's consider that we could have only one event per transaction. 
@modelOptions({ schemaOptions: { collection: 'fee-events' } })
class FeeEventSchema {
    @prop()
    public blockNumber!: number;

    @prop()
    public transactionHash!: string;

    @prop()
    public chainId!: ChainId;

    @prop()
    public token!: string;

    @prop({ index: true })
    public integrator!: string;
    
    @prop()
    public integratorFee!: string;

    @prop()
    public lifiFee!: string;
}
  
export const FeeEvent = getModelForClass(FeeEventSchema);
export type IFeeEvent = FeeEventSchema;