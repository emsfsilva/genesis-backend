import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Injectable()
// JwtAuthGuard protege rotas exigindo que o token JWT esteja presente e válido
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // Este método é executado sempre que uma rota protegida é acessada
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Acessa o objeto Request da requisição HTTP
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization']; // Ex: "Bearer eyJhbGciOi..."

    // Verifica se o cabeçalho Authorization está presente e bem formatado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido ou malformado');
    }

    // Remove o prefixo "Bearer " para obter apenas o token JWT
    const token = authHeader.replace('Bearer ', '');

    try {
      // Verifica e decodifica o token usando a chave secreta
      const user = this.jwtService.verify<LoginPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      // Anexa os dados do usuário decodificado no request (req.user)
      request.user = user;

      // Permite o acesso à rota
      return true;
    } catch (error) {
      // Se a verificação falhar, lança erro de não autorizado
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
