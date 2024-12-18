import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarketPlaceDocument = HydratedDocument<MarketPlace>;

@Schema({ timestamps: true })
export class MarketPlace {
  @Prop()
  title: string;

  @Prop()
  amount: number;

  @Prop()
  details: string;

  @Prop([String])
  images: string[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null; // Added soft delete field
}
export const MarketPlaceSchema = SchemaFactory.createForClass(MarketPlace);
