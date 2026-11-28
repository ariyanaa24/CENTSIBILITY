import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Gets { userId, email } that JwtStrategy put on the request
// Usage in a controller:  create(@CurrentUser() user) { ... user.userId ... }
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  // request.user was filled by JwtStrategy.validate() after the token was checked.
  return ctx.switchToHttp().getRequest().user as { userId: number; email: string };
});
