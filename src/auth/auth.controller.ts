import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Req,
  // UseGuards,
  UsePipes,
  ValidationPipe,
  // UseGuards,
} from '@nestjs/common';
// import { LocalAuthGuard } from './guards/local_guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dtos/createuser.dto';
import { LoginUserDTO } from 'src/users/dtos/loginuser.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDTO) {
    return await this.authService.validateLogin(loginUserDto);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() createUserDto: CreateUserDTO) {
    console.log('REQUEST :::', createUserDto);
    const result = await this.authService.validateCreateUser(createUserDto);
    return result;
  }

  @Post('resend-otp')
  async resendOtp(@Req() req: Request) {
    console.log('RESEND_OTP REQ :: ', req.body);
    const { email_address } = req.body;
    const result = await this.authService.resendOtp(email_address);
    return result;
  }

  @Post('verify')
  async verifyAccount(@Req() req: Request) {
    const { code, email_address } = req.body;
    return await this.authService.validateVerifyOTP({
      code: code,
      email_address: email_address,
    });
  }

  @Post('forgot-password')
  async sendPasswordEmail(@Req() req: Request) {
    // console.log('RESEND_OTP REQ :: ', req.body);
    const { email_address } = req.body;
    const result = await this.authService.sendPasswordResetEmail(email_address);
    return result;
  }

  @Post('verify-forgot-password')
  async verifyResetPass(@Req() req: Request) {
    const { email_address, code } = req.body;
    return await this.authService.verifyResetPass({
      code,
      email_address,
    });
  }

  @Put('reset-password')
  async resetPassword(@Req() req: Request) {
    const { new_password, confirm_password, email_address } = req.body;
    const result = await this.authService.resetPassword(
      new_password,
      confirm_password,
      email_address,
    );
    return result;
  }

  @Get('status')
  async getAuthStatus(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }
}
