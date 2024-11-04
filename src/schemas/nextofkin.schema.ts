import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type NextOfKinDocument = HydratedDocument<NextOfKin>;

@Schema({ timestamps: true })
export class NextOfKin {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email_address: string;

  @Prop()
  phone_number: string;

  @Prop({
    enum: [
      'sibling',
      'grand-parent',
      'parent',
      'cousin',
      'child',
      'step-child',
      'colleague',
      'employee',
      'employer',
      'mentor',
      'nephew',
      'neice',
      'aunty',
      'uncle',
      'step-sibling',
      'neighbour',
    ],
  })
  relationship: string;

  @Prop()
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const NextOfKinSchema = SchemaFactory.createForClass(NextOfKin);
