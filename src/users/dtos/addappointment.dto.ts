import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

enum AppointmentType {
  FAST_TRACK = 'fast-track',
  BOOK_SESSION = 'book-session',
  WORKING_CLASS = 'working-class',
}

export class AddAppointmentDTO {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(AppointmentType)
  category: AppointmentType;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  asset?: string;

  @IsOptional()
  @IsString()
  employer_name?: string;

  @IsOptional()
  @IsString()
  work_address?: string;

  @IsNotEmpty()
  @IsString()
  upload_url: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  appointment_date: string;
}
