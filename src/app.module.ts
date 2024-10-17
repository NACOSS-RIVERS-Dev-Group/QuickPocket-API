import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://appquickpocket:nilZF8z0rIEEh7Ad@cluster0.qzppm.mongodb.net/quickpocket',
      {},
    ),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
