import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt_guard';
import { AddInterestDTO } from './dto/AddInterest.dto';

@Controller('interests')
export class InterestsController {
  constructor(private service: InterestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  @UsePipes(new ValidationPipe())
  showInterest(@Body() body: AddInterestDTO, @Req() req: any) {
    return this.service.saveInterest(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async allUsers() {
    return await this.service.allInterests();
  }
}
