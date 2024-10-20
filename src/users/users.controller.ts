import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  // ParseIntPipe,
  // Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/createuser.dto';
import { UserService } from './users.services';
// import { UserAddressDTO } from './dtos/createuseraddress.dto';
// import { UserGeoDTO } from './dtos/createusergeo.dto';
// import { LoginUserDTO } from './dtos/loginuser.dto';
// import { Request } from 'express';
// import { LocalAuthGuard } from 'src/auth/guards/local_guard';
// import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt_guard';
import { AddNextofKinDTO } from './dtos/addnextofkin.dto';
import { ChangePasswordDTO } from './dtos/changepassword.dto';
import { AccountDeletionDTO } from './dtos/accountdeletion.dto';
import { AddAppointmentDTO } from './dtos/addappointment.dto';
import { UpdateUserDTO } from './dtos/updateuser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('notifications/general')
  getUsers() {
    return this.userService.findAllNotifications();
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('create')
  // @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @UsePipes(new ValidationPipe())
  updateUser(@Body() body: UpdateUserDTO, @Req() req: any) {
    console.log('ID :: ', req.user);

    if (!req?.user) {
      throw new HttpException(
        'You are highly forbidden!!!',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.updateUser(req?.user?.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    console.log('PROFILE :: ', req?.user);
    // Now look for this user

    if (!req.user) {
      throw new HttpException(
        'You are highly forbidden!!!',
        HttpStatus.FORBIDDEN,
      );
    }

    const currentUser = await this.userService.findUserByUsername(
      `${req?.user?.sub}`,
    );

    if (!currentUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // Convert Mongoose object to plain JavaScript object
    // const userObject = currentUser.toObject();

    if (currentUser?.password) {
      const { ...rest } = currentUser;

      // console.info(password);

      return {
        user: rest,
      };
    } else {
      return {
        user: currentUser,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async allUsers(
    @Query('page') page: number = 1, // Capture the 'page' query param (optional, with default value)
    @Query('limit') limit: number = 25,
  ) {
    return await this.userService.findUsers(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/nextofkin/add')
  @UsePipes(new ValidationPipe())
  async addNextofKin(@Param('id') id: string, @Body() body: AddNextofKinDTO) {
    return await this.userService.addNextofKin(body, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/nextofkin/info')
  async getNextofKin(@Param('id') id: string) {
    return await this.userService.getNextofKin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/appointment/book')
  @UsePipes(new ValidationPipe())
  async bookAppointment(
    @Param('id') id: string,
    @Body() body: AddAppointmentDTO,
  ) {
    return await this.userService.bookAppointment(body, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(@Body() body: ChangePasswordDTO, @Req() req: any) {
    if (!req.user) {
      throw new HttpException(
        'You are highly forbidden!!!',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userService.changePassword(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async userNotifications(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    return await this.userService.findNotifications(page, limit, req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('referrals')
  async userReferrals(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    console.log('ENTERED THIS PART ::: ');

    return await this.userService.findReferrals(page, limit, req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/account/delete')
  @UsePipes(new ValidationPipe())
  async requestSoftDeleteAcc(
    @Param('id') id: string,
    @Body() body: AccountDeletionDTO,
  ) {
    return await this.userService.requestAccountDeletion(body, id);
  }
}
