import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt_guard';
import { AddMarketplaceItem } from './dto/AddMarketplaceItem';
import { Request } from 'express';
import { uploadMultipleImages } from 'src/utils/image-upload';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private service: MarketplaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        // Extract the first error message from the validation errors
        const firstErrorField = validationErrors[0].field;
        const firstErrorMessage = validationErrors[0].errors[0];

        return new BadRequestException({
          statusCode: 400,
          message: `${firstErrorField}: ${firstErrorMessage}`,
          errors: validationErrors,
        });
      },
    }),
  )
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
  async update(@Body() body: AddMarketplaceItem, @Req() req: any) {
    return this.service.updateMarketplaceItem(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/images')
  async imagesUpload(@Body() body: any, @Req() req: Request) {
    console.log('USER INFO ::: ', req.user);

    return uploadMultipleImages(body?.images);
  }
}
