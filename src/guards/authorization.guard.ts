import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    const isAllowed = user.role.some((userRole) =>
      this.allowedRoles.includes(userRole),
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not authorized. Only admins can perform this operation.',
      );
    }

    return true;
  }
}
