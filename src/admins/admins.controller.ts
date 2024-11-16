import {
  Body,
  Controller,
  Get,
  Inject,
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
import { AdminAuthService } from 'src/adminauth/adminauth.service';
import { CreateAdminDTO } from './dtos/createadmin.dto';

@Controller('admins')
export class AdminsController {
  constructor(
    private adminService: AdminsService,
    @Inject('ADMIN_AUTH_SERVICE') private authAdminService: AdminAuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async allAdmins(
    @Query('page') page: number = 1, // Capture the 'page' query param (optional, with default value)
    @Query('limit') limit: number = 25,
  ) {
    return await this.adminService.findAdmins(page, limit);
  }

  @Post('admin/create')
  async createAdmin(@Body() body: CreateAdminDTO) {
    return await this.authAdminService.validateCreateAdmin(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/:id/suspend')
  async suspendAdmin(@Req() req: any) {
    console.log('Admiin :::: ', req?.params);

    return await this.adminService.suspendAdmin(
      req?.user?.sub,
      req?.params?.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/:id/pardon')
  async pardonAdmin(@Req() req: any) {
    return await this.adminService.pardonAdmin(req?.user?.sub, req?.params?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/:id/delete')
  async deleteAdmin(@Req() req: any) {
    return await this.adminService.deleteAdmin(req?.user?.sub, req?.params?.id);
  }

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
    return await this.adminService.findCurrentAdmin(req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('socials/add')
  async saveSocial(@Req() req: any, @Body() body: AddSocialDTO) {
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
    return await this.adminService.saveBannerAd(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('banners/all')
  async getBanners(@Req() req: any) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.getBanners();
  }

  @UseGuards(JwtAuthGuard)
  @Get('banners/active/all')
  async getActiveBanners(@Req() req: any) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.getActiveBanners();
  }

  @UseGuards(JwtAuthGuard)
  @Put('banners/:id/update')
  async updateBanner(@Req() req: any) {
    const bannerId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.updateBannerAd(
      req.body,
      currUsername,
      bannerId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('banners/:id/delete')
  async deleteBanner(@Req() req: any) {
    const bannerId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.deleteBannerAd(currUsername, bannerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('socials/:id/update')
  async updateSocial(@Req() req: any) {
    const socialId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.updateSocial(
      req.body,
      currUsername,
      socialId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('socials/:id/delete')
  async deletSocial(@Req() req: any) {
    const socialId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.deleteSocial(currUsername, socialId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('settings/manage')
  async manageSettings(@Req() req: any, @Body() body: any) {
    const currUsername = req.user?.sub;
    return await this.adminService.manageSettings(body, currUsername);
  }

  @Get('settings/all')
  async getSettings() {
    return await this.adminService.findSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Post('locations/add')
  async saveLocation(@Req() req: any, @Body() body: any) {
    return await this.adminService.saveLocation(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('locations/:id/update')
  async updateLocation(@Req() req: any) {
    const locationId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.updateLocation(
      req.body,
      currUsername,
      locationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('locations/:id/delete')
  async deleteLocation(@Req() req: any) {
    const locationid = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.deleteLocation(currUsername, locationid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('locations/all')
  async getLocations() {
    return await this.adminService.getLocations();
  }

  @UseGuards(JwtAuthGuard)
  @Post('reasons/add')
  async saveReason(@Req() req: any, @Body() body: any) {
    return await this.adminService.saveReason(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reasons/all')
  async getReasons() {
    return await this.adminService.getReasons();
  }

  @UseGuards(JwtAuthGuard)
  @Put('reasons/:id/update')
  async updateReason(@Req() req: any) {
    const reasonId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.updateReason(
      req.body,
      currUsername,
      reasonId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('reasons/:id/delete')
  async deleteReason(@Req() req: any) {
    const reasonId = req.params?.id;
    const currUsername = req.user?.sub;
    return await this.adminService.deleteReason(currUsername, reasonId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('activities/all')
  async allActivities(
    @Query('page') page: number = 1, // Capture the 'page' query param (optional, with default value)
    @Query('limit') limit: number = 25,
  ) {
    return await this.adminService.allActivities(page, limit);
  }
}
