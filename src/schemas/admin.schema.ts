import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AdminRoles } from 'src/admins/dtos/createadmin.dto';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true, // Include virtual fields
    versionKey: false, // Disable __v field
    transform(doc, ret) {
      ret.id = ret._id; // You can optionally add the id field
      delete ret._id; // Remove the _id field if needed
      delete ret.password; // Remove sensitive data like password
    },
  },
  toObject: {
    virtuals: true, // Include virtual fields
    versionKey: false, // Disable __v field
    transform(doc, ret) {
      ret.id = ret._id; // You can optionally add the id field
      delete ret._id; // Remove the _id field if needed
      delete ret.password; // Remove sensitive data like password
    },
  },
})
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

  @Prop({ unique: true, required: true })
  phone_number: string;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Prop({ enum: ['admin', 'superadmin'], default: 'admin' })
  type: string;

  @Prop({ enum: AdminRoles, default: 'manager' })
  role: AdminRoles;

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

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
