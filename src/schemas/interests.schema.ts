import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { MarketPlace } from './marketplace.schema';

export type InterestsDocument = HydratedDocument<Interests>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true, // Include virtual fields
    versionKey: false, // Disable __v field
    transform(doc, ret) {
      ret.id = ret._id; // You can optionally add the id field
    },
  },
  toObject: {
    virtuals: true, // Include virtual fields
    versionKey: false, // Disable __v field
    transform(doc, ret) {
      ret.id = ret._id; // You can optionally add the id field
    },
  },
})
export class Interests {
  @Prop()
  interest_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MarketPlace' })
  marketplace: MarketPlace;
}

export const InterestsSchema = SchemaFactory.createForClass(Interests);
