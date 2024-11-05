import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginAdminDTO {
  @IsEmail({}, { message: 'Enter a valid email addresss' })
  @IsNotEmpty({ message: 'Email address is required' })
  email_address: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 255, { message: 'Password must be at least 8 characters long' })
  password: string;
}
