import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';

export type ActivitiesDocument = HydratedDocument<Activities>;

@Schema({ timestamps: true })
export class Activities {
  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  admin: Admin;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
