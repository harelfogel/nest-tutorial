import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // context= wrapper into incoming request
    const request = context.switchToHttp().getRequest();
    return request.CurrentUser;
  },
);
