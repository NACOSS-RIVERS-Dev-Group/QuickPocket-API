import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Interests, InterestsSchema } from 'src/schemas/interests.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MarketPlace, MarketPlaceSchema } from 'src/schemas/marketplace.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interests.name, schema: InterestsSchema },
      { name: User.name, schema: UserSchema },
      { name: MarketPlace.name, schema: MarketPlaceSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [InterestsService],
  controllers: [InterestsController],
})
export class InterestsModule {}
