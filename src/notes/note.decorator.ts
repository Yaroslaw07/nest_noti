import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const NoteId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.headers?.note_id;
  },
);
