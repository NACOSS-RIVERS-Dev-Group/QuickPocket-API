import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt_guard';
import { AdminsService } from './admins.service';

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
  @Get('current/profile')
  async profile(@Req() req: any) {
    console.log('CURRENT ADMIN', req.user);
    return await this.adminService.findCurrentAdmin(req?.user?.sub);
  }
}
