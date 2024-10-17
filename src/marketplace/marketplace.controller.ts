import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt_guard';
import { AddMarketplaceItem } from './dto/AddMarketplaceItem';
import { Request } from 'express';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private service: MarketplaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UsePipes(new ValidationPipe())
  async addItem(@Body() body: AddMarketplaceItem) {
    return this.service.addMarketplaceItem(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async all(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    return this.service.all(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@Body() body: AddMarketplaceItem, @Req() req: Request) {
    console.log('USER INFO ::: ', req.user);

    // return this.service.updateMarketplaceItem(body, req?.user);
  }
}
