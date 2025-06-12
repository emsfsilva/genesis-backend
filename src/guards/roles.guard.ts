import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator'; // Decorador @Roles()
import { UserType } from '../user/enum/user-type.enum'; // Enum com tipos de usuário
import { Request } from 'express';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Injectable()
// RolesGuard limita o acesso a rotas com base no tipo de usuário
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Executado ao acessar rotas com @Roles()
  canActivate(context: ExecutionContext): boolean {
    // Recupera os papéis exigidos da rota usando o decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há roles exigidos, permite acesso
    if (!requiredRoles) {
      return true;
    }

    // Obtém o objeto Request
    const request = context.switchToHttp().getRequest<Request>();

    // Pega o usuário que foi preenchido pelo JwtAuthGuard
    const user = request.user as LoginPayload;

    // Se não há usuário no request (token inválido?), nega acesso
    if (!user) {
      return false;
    }

    // Verifica se o tipo do usuário está entre os exigidos
    return requiredRoles.includes(user.typeUser);
  }
}
