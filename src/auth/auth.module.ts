import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.services';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from 'src/typeorm/entities/user';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/local_strategy';
// import { Address } from 'src/typeorm/entities/address';
// import { Geo } from 'src/typeorm/entities/geo';
import { JwtStrategy } from './utils/jwt_strategy';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';
import { NextOfKin, NextOfKinSchema } from 'src/schemas/nextofkin.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { Requests, RequestsSchema } from 'src/schemas/requests.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { OtpService } from 'src/otp/otp.service';
import { OTP, OTPSchema } from 'src/schemas/otp.schema';
import { Referral, ReferralSchema } from 'src/schemas/referral.schema';
import { AdminAuthService } from 'src/adminauth/adminauth.service';
import { AdminsService } from 'src/admins/admins.service';
import { Activities, ActivitiesSchema } from 'src/schemas/activities.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
// import { MailService } from 'src/mail/mail.service';
// import { Otp } from 'src/typeorm/entities/otp';
// import { OtpService } from 'src/otp/otp.service';
// import { GoogleStrategy } from './utils/google_strategy';
// import { History } from 'src/typeorm/entities/history';
// import { HistoryService } from 'src/history/history.service';
// import { SocketGateway } from 'src/socket/socket.gateway';
// import { SocketService } from 'src/socket/socket.service';
// import { Customer } from 'src/typeorm/entities/customers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: NextOfKin.name, schema: NextOfKinSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Requests.name, schema: RequestsSchema },
      { name: OTP.name, schema: OTPSchema },
      { name: Referral.name, schema: ReferralSchema },
      { name: Activities.name, schema: ActivitiesSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'abc123JakasMan123@09nmdhyuDiloe((30(())',
      signOptions: { expiresIn: '5h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    {
      provide: 'ADMIN_AUTH_SERVICE',
      useClass: AdminAuthService,
    },
    {
      provide: 'ADMIN_SERVICE',
      useClass: AdminsService,
    },
    {
      provide: 'OTP_SERVICE',
      useClass: OtpService,
    },
    // GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
