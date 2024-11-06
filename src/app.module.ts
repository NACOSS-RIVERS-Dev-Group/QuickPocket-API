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
// import { AdminAuthService } from './adminauth/adminauth.service';
// import { AdminsService } from './admins/admins.service';
// import { Admin } from './schemas/admin.schema';

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
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'app.quickpocket@gmail.com',
          pass: 'savhpzwofeqzrhcd',
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
