import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from 'src/utils/password';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { LoginPayload } from './dtos/loginPayload.dto';
import { ReturnLogin } from './dtos/returnLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const user: UserEntity | undefined = await this.userService
      .findUserByLoginSei(loginDto.loginSei)
      .catch(() => undefined);

    const isMatch = await validatePassword(
      loginDto.password,
      user?.password || '',
    );

    if (!user || !isMatch) {
      throw new NotFoundException('loginSei ou Password esta invalido');
    }
    // Criar o LoginPayload com os dados do usuário
    const loginPayload = new LoginPayload(user);
    console.log('Dados do LoginPayload:', loginPayload);

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
