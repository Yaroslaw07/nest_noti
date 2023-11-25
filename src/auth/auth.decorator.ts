import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './dto/jwt-payload';

export const AuthUser = createParamDecorator((context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user as JwtPayload;
});
