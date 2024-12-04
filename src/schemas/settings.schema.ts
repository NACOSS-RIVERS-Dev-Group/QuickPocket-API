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

  @Prop({ default: ' ' })
  get_started: string;

  @Prop({ default: ' ' })
  get_started_title: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
