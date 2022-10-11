import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type ReqUser = {
  email: string;
  id: number;
};

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ReqUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
