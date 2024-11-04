import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginAdminDTO {
  @IsEmail({}, { message: "Enter a valid email addresss" })
  @IsNotEmpty({ message: "Email address is required" })
  email_address: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}