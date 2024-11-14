import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
  @Prop()
  phone_number: string;

  @Prop()
  email_address: string;

  @Prop()
  office_address: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
