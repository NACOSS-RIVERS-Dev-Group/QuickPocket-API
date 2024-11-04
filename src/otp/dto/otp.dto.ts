import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OTPPayloadDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email_address: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
