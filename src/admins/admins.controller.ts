import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt_guard';
import { AdminsService } from './admins.service';
import { AddSocialDTO } from './dtos/addsocial.dto';
import { AddBannerDTO } from './dtos/addbanner.dto';

@Controller('admins')
export class AdminsController {
  constructor(private adminService: AdminsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('bookings/all')
  async allBookings(
    @Query('page') page: number = 1, // Capture the 'page' query param (optional, with default value)
    @Query('limit') limit: number = 25,
  ) {
    return await this.adminService.findBookings(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/category/all')
  async categoryBookings(
    @Query('category') category: string,
    @Query('page') page: number = 1, // Capture the 'page' query param (optional, with default value)
    @Query('limit') limit: number = 25,
  ) {
    console.log('JKD KJHSD ', category);

    return await this.adminService.findBookingsByCategory(
      page,
      limit,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('bookings/:id/approve')
  async approveBooking(@Req() req: any) {
    const bookingID = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.approveBooking(bookingID, currUsername);
  }

  @UseGuards(JwtAuthGuard)
  @Put('bookings/:id/decline')
  async declineBooking(@Req() req: any) {
    const bookingID = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.declineBooking(bookingID, currUsername);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current/profile')
  async profile(@Req() req: any) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.findCurrentAdmin(req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('socials/add')
  async saveSocial(@Req() req: any, @Body() body: AddSocialDTO) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.saveSocial(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('socials/all')
  async getSocials(@Req() req: any) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.getSocials();
  }

  @UseGuards(JwtAuthGuard)
  @Post('banners/add')
  async saveBanner(@Req() req: any, @Body() body: AddBannerDTO) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.saveBannerAd(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('banners/all')
  async getBanners(@Req() req: any) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.getBanners();
  }
}
