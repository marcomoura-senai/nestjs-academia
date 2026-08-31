import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '../../auth/jwt.service';
import { Request } from 'express';
import { AuthUserDto } from '../dto/auth-user.dto';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesEnum } from '../../roles/roles.entity';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  private extractToken(context: ExecutionContext) {
    const expressReq = context.switchToHttp().getRequest<Request>();

    if (!expressReq.headers.authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const [bearerString, token] = expressReq.headers.authorization.split(' ');

    if (bearerString !== 'Bearer') {
      throw new UnauthorizedException('Invalid token provided');
    }

    return token;
  }

  private setPayload(context: ExecutionContext, payload: AuthUserDto) {
    context.switchToHttp().getRequest<Request>()['user'] = payload;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const payload = this.jwtService.verify(this.extractToken(context));
    if (payload.iss !== 'sctec') {
      // TODO: colocar issuer na variável de ambiente
      throw new UnauthorizedException('Invalid token provided');
    }

    const requiredRoles = this.reflector.get<RolesEnum[] | undefined>(
      ROLES_KEY,
      context.getHandler(), // É o método do controller que possui a anotação @Roles
    );

    if (requiredRoles) {
      const hasAccess = requiredRoles.every((requiredRole) =>
        payload.data.roles.includes(requiredRole),
      );

      if (!hasAccess) {
        throw new UnauthorizedException(
          'You do not have access to this resource',
        );
      }
    }

    this.setPayload(context, payload);
    return true;
  }
}
