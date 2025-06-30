import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPasswordHashed, validatePassword } from 'src/utils/password';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { MasterEntity } from 'src/master/entities/master.entity';
import { AuxiliarEntity } from 'src/auxiliar/entities/auxiliar.entity';
import { UserType } from './enum/user-type.enum';
import { OmeEntity } from 'src/ome/entities/ome.entity';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(MasterEntity)
    private readonly masterRepository: Repository<MasterEntity>,

    @InjectRepository(AuxiliarEntity)
    private readonly auxiliarRepository: Repository<AuxiliarEntity>,

    @InjectRepository(OmeEntity)
    private readonly omeRepository: Repository<OmeEntity>,
  ) { }

  async createUser(
    createUserDto: CreateUserDto,
    loggedUser: LoginPayload,
  ): Promise<UserEntity> {
    /* VERIFICA SE O LOGIN SEI JA EXISTE */
    const user = await this.findUserByLoginSei(createUserDto.loginSei).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Esse LoginSei já está em Uso');
    }
    /* VERIFICA SE A MATRICULA JA EXISTE */
    const existingMat = await this.userRepository.findOne({
      where: { mat: createUserDto.mat },
    });

    if (existingMat) {
      throw new BadRequestException('Essa Matricula já está em uso.');
    }

    /* SE O USUARIO LOGADO FOR AUXILIAR */
    if (loggedUser.typeUser === UserType.Auxiliar) {
      /* ENTAO SÓ PODE CRIAR AUXILIAR OU COMUM */
      const allowedTypes = [UserType.Auxiliar, UserType.Comum];
      if (!allowedTypes.includes(createUserDto.typeUser)) {
        throw new BadRequestException(
          'Usuário auxiliar só pode criar usuários de tipo Auxiliar ou Comum.',
        );
      }

      /* USUARIO LOGADO SO PODE CRIAR NA MESMA OME A QUAL PERTENCE */
      if (createUserDto.omeId !== loggedUser.omeId) {
        throw new BadRequestException(
          'Usuário auxiliar só pode criar usuários da mesma OME.',
        );
      }
    }

    /* SENHA PADRAO PARA TODOS USUARIOS CRIADOS */
    const passwordHashed = await createPasswordHashed('genesispmpe');

    // Define o tipo com base no pg
    const pg = createUserDto.pg.trim();
    const pracas = ['Al Cfsd', 'Sd', 'Cb', '3º Sgt', '2º Sgt', '1º Sgt', 'St'];
    const oficiais = [
      'Al Cfoa',
      'Al Cfo',
      'Asp',
      '2º Ten',
      '1º Ten',
      'Cap',
      'Maj',
      'Tc',
      'Cel',
    ];

    let tipo: string | undefined = undefined;

    if (pracas.includes(pg)) {
      tipo = 'P';
    } else if (oficiais.includes(pg)) {
      tipo = 'O';
    }

    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: passwordHashed,
      tipo,
    });

    if (newUser.typeUser === UserType.Auxiliar) {
      const auxiliar = new AuxiliarEntity();
      auxiliar.userId = newUser.id;
      await this.auxiliarRepository.save(auxiliar);
    } else if (newUser.typeUser === UserType.Comum) {
      //const comum = new ComumEntity();
      //comum.userId = newUser.id;
      //await this.comumRepository.save(comum);
    } else if (newUser.typeUser === UserType.Diretor) {
      //const diretor = new DiretorEntity();
      //diretor.userId = newUser.id;
      //await this.diretorRepository.save(diretor);
    } else if (newUser.typeUser === UserType.Gestao) {
      //const gestao = new GestaoEntity();
      //gestao.userId = newUser.id;
      //await this.gestaoRepository.save(gestao);
    } else if (newUser.typeUser === UserType.Tecnico) {
      //const tecnico = new TecnicoEntity();
      //tecnico.userId = newUser.id;
      //await this.tecnicoRepository.save(tecnico);
    } else if (newUser.typeUser === UserType.Master) {
      const master = new MasterEntity();
      master.userId = newUser.id;
      await this.masterRepository.save(master);
    }

    return newUser;
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`userId: ${userId} Id não Encontrado`);
    }

    return user;
  }

  async findUserByLoginSei(loginSei: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        loginSei,
      },
      relations: {
        ome: {
          diretoria: {
            dpo: false,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `loginSei: ${loginSei} loginSei não Encontrado`,
      );
    }

    return user;
  }

  async updateUser(
    userId: number,
    data: Partial<CreateUserDto>,
    loggedUser: LoginPayload,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    // Restrição para Auxiliar
    if (loggedUser.typeUser === UserType.Auxiliar) {
      const isTipoValido =
        user.typeUser === UserType.Comum || user.typeUser === UserType.Auxiliar;

      if (!isTipoValido) {
        throw new BadRequestException(
          'Auxiliares só podem editar usuários do tipo Auxiliar ou Comum.',
        );
      }

      if (user.omeId !== loggedUser.omeId) {
        throw new BadRequestException(
          'Auxiliares só podem editar usuários da mesma OME.',
        );
      }
    }

    if (data.mat) {
      const existingMat = await this.userRepository.findOne({
        where: { mat: data.mat },
      });

      if (existingMat && existingMat.id !== user.id) {
        throw new BadRequestException(
          'Essa Matricula já está em uso por outro usuário.',
        );
      }
    }

    // Atualiza tipo baseado no pg, se fornecido
    if (data.pg) {
      const pg = data.pg.trim();
      const pracas = [
        'Al Cfsd',
        'Sd',
        'Cb',
        '3º Sgt',
        '2º Sgt',
        '1º Sgt',
        'St',
      ];
      const oficiais = [
        'Al Cfoa',
        'Al Cfo',
        'Asp',
        '2º Ten',
        '1º Ten',
        'Cap',
        'Maj',
        'Tc',
        'Cel',
      ];

      if (pracas.includes(pg)) data.tipo = 'P';
      else if (oficiais.includes(pg)) data.tipo = 'O';
      else data.tipo = undefined;
    }

    if (data.omeId) {
      const ome = await this.omeRepository.findOne({
        where: { id: data.omeId },
      });
      if (!ome) {
        throw new NotFoundException(`Ome com ID ${data.omeId} não encontrado`);
      }
    }

    Object.assign(user, data);

    if (data.omeId) {
      user.omeId = data.omeId;
      user.ome = undefined;
    }

    return this.userRepository.save(user);
  }

  async deleteUser(userId: number, loggedUser: LoginPayload): Promise<void> {
    const user = await this.findUserById(userId);

    if (loggedUser.typeUser === UserType.Auxiliar) {
      const isTipoValido =
        user.typeUser === UserType.Comum || user.typeUser === UserType.Auxiliar;

      if (!isTipoValido) {
        throw new BadRequestException(
          'Auxiliares só podem excluir usuários do tipo Auxiliar ou Comum.',
        );
      }

      if (user.omeId !== loggedUser.omeId) {
        throw new BadRequestException(
          'Auxiliares só podem excluir usuários da mesma OME.',
        );
      }
    }

    await this.userRepository.delete(userId);
  }

  async updatePasswordUser(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: number,
    loggedUser: LoginPayload,
  ): Promise<UserEntity> {
    if (loggedUser.id !== userId) {
      throw new BadRequestException(
        'Você só pode alterar a sua própria senha.',
      );
    }

    const user = await this.findUserById(userId);

    const isMatch = await validatePassword(
      updatePasswordDTO.lastPassword,
      user.password || '',
    );

    if (!isMatch) {
      throw new BadRequestException('Senha atual está incorreta');
    }

    const passwordHashed = await createPasswordHashed(
      updatePasswordDTO.newPassword,
    );

    return this.userRepository.save({ ...user, password: passwordHashed });
  }

  async resetPassword(
    userId: number,
    loggedUser: LoginPayload,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    if (loggedUser.typeUser === UserType.Auxiliar) {
      const isTipoValido =
        user.typeUser === UserType.Comum || user.typeUser === UserType.Auxiliar;

      if (!isTipoValido) {
        throw new BadRequestException(
          'Auxiliares só podem redefinir senhas de usuários do tipo Auxiliar ou Comum.',
        );
      }

      if (user.omeId !== loggedUser.omeId) {
        throw new BadRequestException(
          'Auxiliares só podem redefinir senhas de usuários da mesma OME.',
        );
      }
    }

    const defaultPassword = 'genesispmpe';
    const passwordHashed = await createPasswordHashed(defaultPassword);

    user.password = passwordHashed;
    return this.userRepository.save(user);
  }
}
