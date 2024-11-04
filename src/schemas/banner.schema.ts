import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BannerDocument = HydratedDocument<Banner>;

@Schema({ timestamps: true })
export class Banner {
  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  preview: string;

  @Prop()
  amount: number;

  @Prop({ enum: ['active', 'pending', 'completed', 'canceled'] })
  status: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
