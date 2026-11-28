import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * PATCH body: every field is optional, so the client sends only what changes.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'firstName must not be empty.' })
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'lastName must not be empty.' })
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address.' })
  @MaxLength(100)
  email?: string;
}
