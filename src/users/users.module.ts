import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { NextOfKin, NextOfKinSchema } from 'src/schemas/nextofkin.schema';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { Requests, RequestsSchema } from 'src/schemas/requests.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: NextOfKin.name, schema: NextOfKinSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Requests.name, schema: RequestsSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    // {
    //   provide: 'HISTORY_SERVICE',
    //   useClass: HistoryService,
    // },
    UserService,
  ],
})
export class UsersModule {}

// export class UsersModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(UsersMiddleware).forRoutes('users');
//   }
// }
