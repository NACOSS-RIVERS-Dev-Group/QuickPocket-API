import { Module } from '@nestjs/common';
import { AdminAuthService } from './adminauth.service';
import { Activities, ActivitiesSchema } from 'src/schemas/activities.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { OTP, OTPSchema } from 'src/schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminsService } from 'src/admins/admins.service';
import { OtpService } from 'src/otp/otp.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/local_strategy';
import { JwtStrategy } from './utils/jwt_strategy';
import { AdminAuthController } from './adminauth.controller';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: OTP.name, schema: OTPSchema },
      { name: Activities.name, schema: ActivitiesSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'abc123JakasMan123@09nmdhyuDiloe((30(())',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [
    {
      provide: 'ADMIN_SERVICE',
      useClass: AdminsService,
    },
    {
      provide: 'ADMIN_AUTH_SERVICE',
      useClass: AdminAuthService,
    },
    {
      provide: 'OTP_SERVICE',
      useClass: OtpService,
    },
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AdminAuthModule {}
