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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(MasterEntity)
    private readonly masterRepository: Repository<MasterEntity>,

    @InjectRepository(AuxiliarEntity)
    private readonly auxiliarRepository: Repository<AuxiliarEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserByLoginSei(createUserDto.loginSei).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Esse loginSei já está cadastrado');
    }

    // Define a senha padrão
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
    } else if (newUser.typeUser === UserType.Gestao) {
      //const gestao = new GestaoEntity();
      //gestao.userId = newUser.id;
      //await this.gestaoRepository.save(gestao);
    } else if (newUser.typeUser === UserType.Master) {
      const master = new MasterEntity();
      master.userId = newUser.id;
      await this.masterRepository.save(master);
    }

    console.log(' a variavel newUser é', newUser);

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
      throw new NotFoundException(`UserId: ${userId} Id não Encontrado`);
    }

    return user;
  }

  async findUserByLoginSei(loginSei: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        loginSei,
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
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findUserById(userId);

    await this.userRepository.delete(userId);
  }

  async updatePasswordUser(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    const passwordHashed = await createPasswordHashed(
      updatePasswordDTO.newPassword,
    );

    const isMatch = await validatePassword(
      updatePasswordDTO.lastPassword,
      user.password || '',
    );

    if (!isMatch) {
      throw new BadRequestException('Ultima Senha está Incorreta');
    }

    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }

  async resetPassword(userId: number): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const defaultPassword = 'genesispmpe';
    const passwordHashed = await createPasswordHashed(defaultPassword);

    user.password = passwordHashed;
    return await this.userRepository.save(user);
  }
}
