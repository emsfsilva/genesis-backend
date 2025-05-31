import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      console.log('Token não fornecido');
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authorization.replace('Bearer ', '');
    //console.log('Token recebido:', token);

    try {
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      //console.log('Usuário validado:', user);
      request.user = user;
      return true;
    } catch (error) {
      console.log('Erro na validação do token:', error);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
