import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReasonDocument = HydratedDocument<Reason>;

@Schema({ timestamps: true })
export class Reason {
  @Prop()
  title: string;
}

export const ReasonSchema = SchemaFactory.createForClass(Reason);
