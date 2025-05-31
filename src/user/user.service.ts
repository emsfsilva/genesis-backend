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
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AdmEntity } from 'src/adm/entities/adm.entity';
import { CaEntity } from 'src/ca/entities/ca.entity';
import { AlunoService } from 'src/aluno/aluno.service';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { CmtciaEntity } from 'src/cmtcia/entities/cmtcia.entity';
import { SubcomEntity } from 'src/subcom/entities/subcom.entity';
import { MasterEntity } from 'src/master/entities/master.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,

    @InjectRepository(AdmEntity)
    private readonly admRepository: Repository<AdmEntity>,

    @InjectRepository(CmtciaEntity)
    private readonly cmtciaRepository: Repository<CmtciaEntity>,

    @InjectRepository(CaEntity)
    private readonly caRepository: Repository<CaEntity>,

    @InjectRepository(SubcomEntity)
    private readonly subcomRepository: Repository<SubcomEntity>,

    @InjectRepository(MasterEntity)
    private readonly masterRepository: Repository<MasterEntity>,

    private readonly alunoService: AlunoService,
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

    if (newUser.typeUser === 1) {
      const aluno = new AlunoEntity();
      aluno.userId = newUser.id;
      aluno.turmaId = null;
      aluno.resp1 = null;
      aluno.resp2 = null;
      aluno.grauInicial = 10;
      await this.alunoRepository.save(aluno);
    }

    if (newUser.typeUser === 3) {
      const monitor = new MonitorEntity();
      monitor.userId = newUser.id;
      monitor.ciaId = null; // Sem Cia
      await this.monitorRepository.save(monitor);
    }

    if (newUser.typeUser === 5) {
      const adm = new AdmEntity();
      adm.userId = newUser.id;
      adm.ciaId = null; // Sem Cia
      await this.admRepository.save(adm);
    }

    if (newUser.typeUser === 6) {
      const cmtcia = new CmtciaEntity();
      cmtcia.userId = newUser.id;
      cmtcia.ciaId = null; // Sem Cia
      await this.cmtciaRepository.save(cmtcia);
    }

    if (newUser.typeUser === 7) {
      const ca = new CaEntity();
      ca.userId = newUser.id;
      await this.caRepository.save(ca);
    }

    if (newUser.typeUser === 8) {
      const subcom = new SubcomEntity();
      subcom.userId = newUser.id;
      await this.subcomRepository.save(subcom);
    }

    if (newUser.typeUser === 10) {
      const master = new MasterEntity();
      master.userId = newUser.id;
      await this.masterRepository.save(master);
    }

    return newUser;
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['typeUser'],
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      const relations: any = {
        addresses: {
          city: {
            state: true,
          },
        },
      };

      if (user.typeUser === 1) {
        relations.aluno = {
          turma: {
            cia: true,
          },
          responsavel1: true,
          responsavel2: true,
        };
      } else if (user.typeUser === 4) {
        relations.monitor = { cia: true };
      } else if (user.typeUser === 5) {
        relations.adm = { cia: true };
      } else if (user.typeUser === 6) {
        //relations.cmtcia = true;
      } else if (user.typeUser === 7) {
        //relations.ca = true;
      } else if (user.typeUser === 8) {
        //relations.subcom = true;
      } else if (user.typeUser === 10) {
        //relations.master = true;
      }

      const userWithRelations = await this.userRepository.findOne({
        where: { id: userId },
        relations,
      });

      if (!userWithRelations)
        throw new NotFoundException('Usuário não encontrado');

      if (userWithRelations.typeUser === 1 && userWithRelations.aluno) {
        const grauAtual = await this.alunoService.calcularGrauAtual(
          userWithRelations.id,
        );
        (userWithRelations.aluno as any).grauAtual = grauAtual;
      }

      return userWithRelations;
    } catch (error) {
      console.error('Erro ao buscar usuário com relações:', error);
      throw new BadRequestException('Erro ao buscar usuário');
    }
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

    // Deletar registros relacionados de forma controlada
    if (user.typeUser === 1) {
      await this.alunoRepository.delete({ userId });
    }

    if (user.typeUser === 3) {
      await this.monitorRepository.delete({ userId });
    }

    if (user.typeUser === 5) {
      await this.admRepository.delete({ userId });
    }

    if (user.typeUser === 6) {
      await this.cmtciaRepository.delete({ userId });
    }

    if (user.typeUser === 7) {
      await this.caRepository.delete({ userId });
    }

    if (user.typeUser === 8) {
      await this.subcomRepository.delete({ userId });
    }

    // Agora sim, pode deletar o usuário
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
