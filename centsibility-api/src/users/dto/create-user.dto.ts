import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'firstName is required.' })
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'lastName is required.' })
  @MaxLength(50)
  lastName: string;

  @IsEmail({}, { message: 'email must be a valid email address.' })
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters.' })
  @MaxLength(72, { message: 'password must be at most 72 characters.' })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)/, { message: 'password must have letters and numbers.' })
  password: string;
}
