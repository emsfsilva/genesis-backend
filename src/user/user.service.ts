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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(MasterEntity)
    private readonly masterRepository: Repository<MasterEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Esse E-mail ja esta Cadastrado');
    }
    const passwordHashed = await createPasswordHashed(createUserDto.password);

    // Criação do usuário
    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: passwordHashed,
    });

    if (newUser.typeUser === 10) {
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
      throw new NotFoundException(`UserId: ${userId} Id não Encontrado`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} Email não Encontrado`);
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
    const defaultPassword = 'atos';
    const passwordHashed = await createPasswordHashed(defaultPassword);

    user.password = passwordHashed;
    return await this.userRepository.save(user);
  }
}
