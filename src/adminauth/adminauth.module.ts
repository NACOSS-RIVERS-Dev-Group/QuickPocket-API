import { Module } from '@nestjs/common';
import { AdminAuthService } from './adminauth.service';
import { Activities, ActivitiesSchema } from 'src/schemas/activities.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { OTP, OTPSchema } from 'src/schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/admins/admins.service';
import { OtpService } from 'src/otp/otp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: OTP.name, schema: OTPSchema },
      { name: Activities.name, schema: ActivitiesSchema },
    ]),
  ],
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
    JwtService
  ]
})
export class AdminAuthModule {}
