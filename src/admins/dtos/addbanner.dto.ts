import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddBannerDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  preview: string;
}
