import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
export class CreateUserDTO {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @IsAlpha()
  first_name: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @IsAlpha()
  last_name: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email_address: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  international_phone_format: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  dial_code: string;

  @IsOptional()
  @IsString()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  is_email_verified?: boolean;

  @IsOptional()
  @IsString()
  nin?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  referral_code?: string;

  @IsOptional()
  @IsBoolean()
  is_profile_set?: boolean;

  @IsOptional()
  next_login?: any;

  @IsOptional()
  last_login?: any;
}
