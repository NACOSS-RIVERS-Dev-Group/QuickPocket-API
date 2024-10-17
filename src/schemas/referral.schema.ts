import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReferralDocument = HydratedDocument<Referral>;

@Schema({ timestamps: true })
export class Referral {
  @Prop()
  title: string;

  @Prop()
  amount: number;

  @Prop()
  description: string;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
