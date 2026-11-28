import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

/**
 * Business logic for login: check the password and create the JWT.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Logs a user in.
   * Returns { accessToken, tokenType }, or throws 401 if the email or password is wrong.
   */
  async login(dto: LoginDto) {
    // 1. find the user by email (with the password hash)
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    // 2. compare the typed password with the saved hash
    const ok = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!ok) {
      // Same message for a wrong email and a wrong password, so nobody can find out which emails exist.
      throw new UnauthorizedException({
        message: 'Invalid email or password.',
        errors: ['The email or password is incorrect.'],
      });
    }

    // 3. make the JWT (sub = userId)
    const accessToken = await this.jwtService.signAsync({ sub: user.userId, email: user.email });
    return { accessToken, tokenType: 'Bearer' };
  }
}
