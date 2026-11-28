import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Tells Passport how to check a JWT: where to find it and how to verify it.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // Read the token from the header:  Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Expired tokens are rejected.
      ignoreExpiration: false,
      // The same secret that was used to sign the token at login (JWT_SECRET in .env).
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  // Runs after the token signature and expiry are checked
  validate(payload: { sub: number; email: string }) {
    // This object becomes request.user (read it with @CurrentUser()).
    return { userId: payload.sub, email: payload.email };
  }
}
