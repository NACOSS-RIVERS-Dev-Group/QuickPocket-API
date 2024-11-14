import {
  IsAlpha,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsAlphanumeric,
  IsEmail,
} from 'class-validator';

enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
}

enum StatusType {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export class UpdateUser2DTO {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  last_name: string;

  @IsOptional()
  @IsString()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  nin?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email_address: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusType)
  status?: StatusType;
}
