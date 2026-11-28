import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * The data the client must send to log in. Anything else is rejected.
 */
export class LoginDto {
  @IsEmail({}, { message: 'email must be a valid email address.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required.' })
  password: string;
}
