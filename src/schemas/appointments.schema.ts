import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Reason } from './reasons.schema';
import { Location } from './location.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

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
export class Appointment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Reason' })
  reason: Reason;

  @Prop({ enum: ['fast-track', 'working-class', 'book-session'] })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
  location: Location;

  @Prop()
  amount: number;

  @Prop()
  asset: string;

  @Prop()
  asset_proof: string;

  @Prop()
  employer_name: string;

  @Prop()
  work_address: string;

  @Prop()
  appointment_date: string;

  @Prop()
  bank_statement: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    enum: ['booked', 'cancelled', 'completed', 'pending'],
    default: 'pending',
  })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
