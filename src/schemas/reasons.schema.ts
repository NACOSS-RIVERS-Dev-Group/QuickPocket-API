import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReasonDocument = HydratedDocument<Reason>;

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
export class Reason {
  @Prop()
  title: string;
}

export const ReasonSchema = SchemaFactory.createForClass(Reason);
