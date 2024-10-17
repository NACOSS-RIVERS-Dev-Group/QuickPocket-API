import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  photo: string;

  @Prop({ required: true, unique: true })
  email_address: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  is_email_verified: boolean;

  @Prop({ unique: false, required: true })
  international_phone_format: string;

  @Prop({ unique: true, required: true })
  phone_number: string;

  @Prop({ unique: true, required: true })
  nin: string;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Prop({ enum: ['admin', 'superadmin'], default: 'admin' })
  type: string;

  @Prop({ enum: ['manager', 'developer', 'editor'], default: 'manager' })
  role: string;

  @Prop({ enum: ['readonly', 'read/write'], default: 'readonly' })
  access: string;

  @Prop()
  address: string;

  @Prop({ default: false })
  is_profile_set: boolean;

  @Prop()
  next_login: Date;

  @Prop()
  last_login: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
