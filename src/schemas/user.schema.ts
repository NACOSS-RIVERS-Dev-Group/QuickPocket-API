import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User> & { _id: Types.ObjectId }; // HydratedDocument<User>;

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
export class User {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  photoUrl: string;

  @Prop({ required: true, unique: true })
  email_address: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  is_email_verified: boolean;

  @Prop({ unique: false, required: true })
  international_phone_format: string;

  @Prop({ required: true, default: '+234' })
  dial_code: string;

  @Prop({ unique: true, required: true })
  phone_number: string;

  @Prop()
  nin: string;

  @Prop({ unique: true, required: true })
  referral_code: string;

  @Prop()
  dob: Date;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Prop()
  address: string;

  @Prop({ default: false })
  is_profile_set: boolean;

  @Prop()
  next_login: Date;

  @Prop()
  last_login: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
