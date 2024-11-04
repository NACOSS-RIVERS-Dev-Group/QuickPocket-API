import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ReferralDocument = HydratedDocument<Referral>;

@Schema({ timestamps: true })
export class Referral {
  @Prop()
  referrer_code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  referrer: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
