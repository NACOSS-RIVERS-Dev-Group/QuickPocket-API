import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendSMSDTO {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
