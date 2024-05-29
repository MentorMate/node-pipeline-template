import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './users/entities/user.entity';

export const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
