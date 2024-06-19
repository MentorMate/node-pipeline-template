import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@utils/decorators/public.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@auth/services.rmq';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const authorization = this.getAuthorization(context);

    return this.authClient
      .send('validate_user', {
        headers: { authorization },
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.getCurrentUserByContext(user, context);
            return true;
          }
          return false;
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getAuthorization(context: ExecutionContext) {
    const authorization = context.switchToHttp().getRequest()
      .headers?.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'No value was provided for Authentication',
      );
    }
    return authorization;
  }

  private getCurrentUserByContext(user: any, context: ExecutionContext) {
    context.switchToHttp().getRequest().user = user;
  }
}
