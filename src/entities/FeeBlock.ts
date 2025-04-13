import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import { ChainId } from "../chains/Types";

@index({ chainId: 1, blockNumber: 1 }, { unique: true })
@modelOptions({ schemaOptions: { collection: 'fee-blocks' } })
class FeeBlockSchema {
    @prop()
    public blockNumber!: number;

    @prop()
    public eventsCount!: number;

    @prop()
    public chainId!: ChainId;
}
  
export const FeeBlock = getModelForClass(FeeBlockSchema);
export type IFeeBlock = FeeBlockSchema;
