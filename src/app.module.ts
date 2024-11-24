import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { InterestsModule } from './interests/interests.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './notification/notification.module';
import { MailerModule } from '@nestjs-modules/mailer';
// import { ConfigurableModu } from '@nestjs/common'; "@nestjs/config"
import { OtpModule } from './otp/otp.module';
import { AdminsModule } from './admins/admins.module';
// import { AdminAuthController } from './adminauth/adminauth.controller';
import { AdminAuthModule } from './adminauth/adminauth.module';
import { AdminAuthService } from './adminauth/adminauth.service';
import { AdminsService } from './admins/admins.service';
import { OtpService } from './otp/otp.service';
import { Activities, ActivitiesSchema } from './schemas/activities.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OTP, OTPSchema } from './schemas/otp.schema';
import { AppMiddleware } from './app.middleware';
import { PassportModule } from '@nestjs/passport';
import { Appointment, AppointmentSchema } from './schemas/appointments.schema';
import { Social, SocialSchema } from './schemas/socials.schema';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { Settings, SettingsSchema } from './schemas/settings.schema';
import { LocationSchema, Location } from './schemas/location.schema';
import { Reason, ReasonSchema } from './schemas/reasons.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://appquickpocket:nilZF8z0rIEEh7Ad@cluster0.qzppm.mongodb.net/quickpocket',
      {},
    ),
    PassportModule,
    JwtModule.register({
      secret: 'abc123JakasMan123@09nmdhyuDiloe((30(())',
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', //  'rbx116.truehost.cloud',
        port: 465,
        auth: {
          user: 'app.quickpocket@gmail.com', // 'hello@quickpocket.co'
          pass: 'savhpzwofeqzrhcd', // '$10Password!!',
        },
      },
    }),
    // ConfigModule
    UsersModule,
    AuthModule,
    MarketplaceModule,
    InterestsModule,
    NotificationModule,
    OtpModule,
    AdminsModule,
    AdminAuthModule,
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: OTP.name, schema: OTPSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Social.name, schema: SocialSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: Settings.name, schema: SettingsSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Reason.name, schema: ReasonSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AddHeaderMiddleware to routes starting with '/api/v1'
    consumer.apply(AppMiddleware).forRoutes('/api/v1*');
  }
}
