import { getModelForClass, index, prop } from "@typegoose/typegoose";
import { ChainId } from "../chains/Types";

@index({ chainId: 1, blockNumber: 1 })
@index({ transactionHash: 1, blockNumber: 1 }, { unique: true }) //TBD: let's consider that we could have only one event per transaction. 
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

    @prop()
    private createdAt!: Date;

    // public static async findBySpecies(this: ReturnModelType<typeof KittenClass>, species: string) {
    //     return this.find({ species }).exec();
    // }
}
  
export const FeeEvent = getModelForClass(FeeEventSchema);