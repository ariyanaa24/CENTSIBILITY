import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that protects a route with JWT.
 * Use @UseGuards(JwtAuthGuard) on a controller or a method.
 * No valid token = 401 Unauthorized. 'jwt' is the strategy defined in jwt.strategy.ts.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
