import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './dto/jwt-payload';

export const AuthUser = createParamDecorator((_, context: ExecutionContext) => {
  try {
    const request = context.switchToHttp()?.getRequest();

    if (!request) {
      throw new Error('HTTP request context not found');
    }

    return request.user as JwtPayload;
  } catch (error) {
    console.error('Error in AuthUser decorator:', error);
    throw new Error('Unable to extract user from request');
  }
});
