import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationError,
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
  showInterest(@Body() body: AddInterestDTO, @Req() req: any) {
    return this.service.saveInterest(body, req?.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async allUsers() {
    return await this.service.allInterests();
  }
}
