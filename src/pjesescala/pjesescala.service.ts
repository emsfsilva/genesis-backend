import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Not, Raw, Repository } from 'typeorm';
import { PjesEscalaEntity } from './entities/pjesescala.entity';
import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { CreatePjesEscalaDto } from './dtos/create-pjesescala.dto';
import { UpdatePjesEscalaDto } from './dtos/update-pjesescala.dto';
import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { OmeEntity } from 'src/ome/entities/ome.entity';
import { DataSource } from 'typeorm';
import { ReturnPjesEscalaDto } from './dtos/return-pjesescala.dto';
import { UpdateStatusPjesEscalaDto } from './dtos/update-status-pjesescala.dto';
import { UpdateObsPjesEscalaDto } from './dtos/update-obs-pjesescala.dto';

@Injectable()
export class PjesEscalaService {
  constructor(
    @InjectRepository(PjesEscalaEntity)
    private readonly pjesEscalaRepository: Repository<PjesEscalaEntity>,

    @InjectRepository(PjesEventoEntity)
    private readonly pjesEventoRepository: Repository<PjesEventoEntity>,

    @InjectRepository(OmeEntity)
    private readonly omeRepository: Repository<OmeEntity>,

    private readonly dataSource: DataSource,
  ) {}

  private verificarPermissaoDeAcesso(
    evento: PjesEventoEntity,
    user: LoginPayload,
  ): void {
    const { typeUser, omeId: userOmeId } = user;

    if (typeUser !== 10 && typeUser !== 5 && evento.omeId !== userOmeId) {
      throw new BadRequestException(
        'Você não tem permissão para modificar escalas de um Evento de outra UNIDADE.',
      );
    }
  }

  private async verificarLimiteCotasPorMatricula(
    matSgp: number,
    dataInicio: Date,
    novaCota: number,
    manager: EntityManager,
    escalaIdParaIgnorar?: number,
  ): Promise<void> {
    const mes = dataInicio.getMonth() + 1;
    const ano = dataInicio.getFullYear();

    const queryBuilder = manager
      .getRepository(PjesEscalaEntity)
      .createQueryBuilder('escala')
      .setLock('pessimistic_write') // <-- LOCK que evita concorrência
      .where('escala.matSgp = :matSgp', { matSgp })
      .andWhere('EXTRACT(MONTH FROM escala.dataInicio) = :mes', { mes })
      .andWhere('EXTRACT(YEAR FROM escala.dataInicio) = :ano', { ano });

    if (escalaIdParaIgnorar) {
      queryBuilder.andWhere('escala.id != :id', { id: escalaIdParaIgnorar });
    }

    const escalas = await queryBuilder.getMany();
    const totalCotas = escalas.reduce((sum, esc) => sum + esc.ttCota, 0);

    if (totalCotas + novaCota > 12) {
      throw new BadRequestException(
        'Usuário não pode ultrapassar o limite de cotas mensais (12).',
      );
    }
  }

  async getCotasDetalhadasPorMatricula(
    matSgp: number,
    ano: number,
    mes: number,
  ): Promise<{ dia: string; nomeOme: string; ttCota: number }[]> {
    const escalas = await this.pjesEscalaRepository
      .createQueryBuilder('escala')
      .leftJoinAndSelect('escala.ome', 'ome')
      .where('escala.matSgp = :matSgp', { matSgp })
      .andWhere('EXTRACT(MONTH FROM escala.dataInicio) = :mes', { mes })
      .andWhere('EXTRACT(YEAR FROM escala.dataInicio) = :ano', { ano })
      .orderBy('escala.dataInicio', 'ASC')
      .getMany();

    return escalas.map((escala) => ({
      dia: new Date(escala.dataInicio).toISOString().split('T')[0],
      nomeOme: escala.ome?.nomeOme || escala.omeSgp,
      ttCota: escala.ttCota,
    }));
  }

  async getQuantidadePorMatriculaAnoMes(
    matSgp: number,
    ano: number | string,
    mes: number | string,
  ): Promise<number> {
    const parsedAno = parseInt(ano as string, 10);
    const parsedMes = parseInt(mes as string, 10);

    if (isNaN(parsedAno) || isNaN(parsedMes)) {
      throw new BadRequestException('Ano ou mês inválido');
    }

    const inicio = new Date(parsedAno, parsedMes - 1, 1);
    const fim = new Date(parsedAno, parsedMes, 0, 23, 59, 59, 999); // fim do mês

    const resultado = await this.pjesEscalaRepository
      .createQueryBuilder('escala')
      .select('SUM(escala.ttCota)', 'total')
      .where('escala.matSgp = :matSgp', { matSgp })
      .andWhere('escala.dataInicio BETWEEN :inicio AND :fim', {
        inicio,
        fim,
      })
      .getRawOne();

    return Number(resultado.total) || 0;
  }

  async create(
    dto: CreatePjesEscalaDto,
    user: LoginPayload,
  ): Promise<PjesEscalaEntity> {
    return this.dataSource.transaction(async (manager) => {
      const evento = await manager.findOne(PjesEventoEntity, {
        where: { id: dto.pjesEventoId },
        relations: ['pjesdist'],
      });

      if (!evento) throw new NotFoundException('Evento não encontrado');

      /*VERIFICAÇÃO SE O USER LOGADO É O MESMO PARA O QUAL FOI DESTINADO O EVENTO */
      /*EXCETO PARA: USUARIO MASTER E TECNICO*/
      this.verificarPermissaoDeAcesso(evento, user);

      if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
        throw new BadRequestException(
          'Evento homologado. Contate o Administrador.',
        );
      }

      const operacao = await manager.findOne(PjesOperacaoEntity, {
        where: { id: dto.pjesOperacaoId },
        relations: ['pjesescalas'],
      });

      if (!operacao) throw new NotFoundException('Operação não encontrada');

      const dataInicio = new Date(dto.dataInicio);
      const mes = dataInicio.getMonth() + 1;
      const ano = dataInicio.getFullYear();

      if (mes !== evento.mes || ano !== evento.ano) {
        throw new BadRequestException(
          'A data de início não corresponde ao mês/ano do evento.',
        );
      }

      const ttCotaCalculado = dto.horaInicio === dto.horaFinal ? 2 : 1;
      const escalasDaOperacao = operacao.pjesescalas ?? [];
      const tipo = dto.tipoSgp?.toUpperCase();

      if (tipo === 'O') {
        const totalCotasOf = escalasDaOperacao
          .filter((e) => e.tipoSgp?.toUpperCase() === 'O')
          .reduce((sum, e) => sum + e.ttCota, 0);

        if (totalCotasOf + ttCotaCalculado > operacao.ttCtOfOper) {
          throw new BadRequestException(
            `Não ha mais cotas de Oficiais para esse Evento ou Operacao`,
          );
        }
      } else if (tipo === 'P') {
        const totalCotasPrc = escalasDaOperacao
          .filter((e) => e.tipoSgp?.toUpperCase() === 'P')
          .reduce((sum, e) => sum + e.ttCota, 0);

        if (totalCotasPrc + ttCotaCalculado > operacao.ttCtPrcOper) {
          throw new BadRequestException(
            `Não ha mais cotas de Praças para esse Evento ou Operacao`,
          );
        }
      } else {
        throw new BadRequestException(`tipoSgp inválido. Use 'O' ou 'P'.`);
      }

      const ome = await manager.findOne(OmeEntity, {
        where: { id: dto.omeId },
      });

      if (!ome) {
        throw new NotFoundException(`OME não encontrada com id: ${dto.omeId}`);
      }

      const escalaExistente = await manager
        .getRepository(PjesEscalaEntity)
        .createQueryBuilder('escala')
        .where('escala.matSgp = :matSgp', { matSgp: dto.matSgp })
        .andWhere('escala.dataInicio = :dataInicio', {
          dataInicio: dto.dataInicio,
        })
        .getOne();

      if (escalaExistente) {
        // Busca a OME da escala existente
        const omeDaEscalaExistente = await manager.findOne(OmeEntity, {
          where: { id: escalaExistente.omeId },
        });

        throw new BadRequestException(
          `Já existe uma escala para o militar ${dto.matSgp} na data ${
            dto.dataInicio
          } na OME: ${omeDaEscalaExistente?.nomeOme || 'desconhecida'}.`,
        );
      }

      await this.verificarLimiteCotasPorMatricula(
        dto.matSgp,
        dataInicio,
        ttCotaCalculado,
        manager,
      );

      const escala = manager.create(PjesEscalaEntity, {
        ...dto,
        ttCota: ttCotaCalculado,
        dataFinal: dto.dataInicio,
        codVerba: operacao.codVerba,
      });

      const saved = await manager.save(escala);

      return manager.findOne(PjesEscalaEntity, {
        where: { id: saved.id },
        relations: ['pjesoperacao', 'pjesevento'],
      });
    });
  }

  async findAll(
    operacaoId?: number,
    ano?: number,
    mes?: number,
  ): Promise<PjesEscalaEntity[]> {
    const query = this.pjesEscalaRepository
      .createQueryBuilder('escala')
      .leftJoinAndSelect('escala.pjesoperacao', 'pjesoperacao')
      .leftJoinAndSelect('escala.pjesevento', 'pjesevento')
      .leftJoinAndSelect('pjesevento.pjesdist', 'pjesdist');

    if (operacaoId) {
      query.andWhere('escala.pjesOperacaoId = :operacaoId', { operacaoId });
    }

    if (ano) {
      query.andWhere('EXTRACT(YEAR FROM escala.dataInicio) = :ano', { ano });
    }

    if (mes) {
      query.andWhere('EXTRACT(MONTH FROM escala.dataInicio) = :mes', { mes });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<PjesEscalaEntity> {
    const escala = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: [
        'pjesoperacao',
        'pjesevento',
        'pjesevento.pjesdist',
        'userObs',
        'userObs.ome',
      ],
    });

    if (!escala) {
      throw new NotFoundException('Escala não encontrada');
    }

    return escala;
  }

  async update(
    id: number,
    dto: UpdatePjesEscalaDto,
    user: LoginPayload,
  ): Promise<PjesEscalaEntity> {
    return this.dataSource.transaction(async (manager) => {
      const escalaAtual = await manager.findOne(PjesEscalaEntity, {
        where: { id },
        relations: ['pjesoperacao'],
      });

      if (!escalaAtual) {
        throw new NotFoundException('Escala não encontrada');
      }

      // ✅ Impede troca de teto
      if (
        dto.pjesOperacaoId &&
        dto.pjesOperacaoId !== escalaAtual.pjesOperacaoId
      ) {
        throw new BadRequestException(
          'Não é permitido alterar o tipo da verba ja criada.',
        );
      }

      const ome = await manager.findOne(OmeEntity, {
        where: { id: dto.omeId },
      });

      if (!ome) {
        throw new NotFoundException(`OME não encontrada com id: ${dto.omeId}`);
      }

      const eventoId = dto.pjesEventoId ?? escalaAtual.pjesEventoId;

      const evento = await manager.findOne(PjesEventoEntity, {
        where: { id: eventoId },
        relations: ['pjesdist'],
      });

      if (!evento) throw new NotFoundException('Evento não encontrado');

      /*VERIFICAÇÃO SE O USER LOGADO É O MESMO PARA O QUAL FOI DESTINADO O EVENTO */
      /*EXCETO PARA: USUARIO MASTER E TECNICO*/
      this.verificarPermissaoDeAcesso(evento, user);

      if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
        throw new BadRequestException(
          'Evento homologado. Contate o Administrador.',
        );
      }

      const dataInicio = new Date(dto.dataInicio ?? escalaAtual.dataInicio);
      if (isNaN(dataInicio.getTime())) {
        throw new BadRequestException('Data de início inválida');
      }

      const mes = dataInicio.getMonth() + 1;
      const ano = dataInicio.getFullYear();

      if (mes !== evento.mes || ano !== evento.ano) {
        throw new BadRequestException(
          'A nova data de início não corresponde ao mês/ano do evento.',
        );
      }

      const matSgp = dto.matSgp ?? escalaAtual.matSgp;

      const existeoutra = await manager
        .getRepository(PjesEscalaEntity)
        .createQueryBuilder('escala')
        .where('escala.matSgp = :matSgp', { matSgp: dto.matSgp })
        .andWhere('escala.dataInicio = :dataInicio', {
          dataInicio: dto.dataInicio,
        })
        .getOne();

      if (existeoutra) {
        // Busca a OME da escala existente
        const omeDaEscalaExistente = await manager.findOne(OmeEntity, {
          where: { id: existeoutra.omeId },
        });

        throw new BadRequestException(
          `Já existe uma escala para o militar ${dto.matSgp} na data ${
            dto.dataInicio
          } na OME: ${omeDaEscalaExistente?.nomeOme || 'desconhecida'}.`,
        );
      }

      const horaInicio = dto.horaInicio ?? escalaAtual.horaInicio;
      const horaFinal = dto.horaFinal ?? escalaAtual.horaFinal;
      const novoTtCota = horaInicio === horaFinal ? 2 : 1;

      const tipoNovo = (dto.tipoSgp ?? escalaAtual.tipoSgp)?.toUpperCase();
      if (tipoNovo !== 'O' && tipoNovo !== 'P') {
        throw new BadRequestException(`tipoSgp inválido. Use 'O' ou 'P'.`);
      }

      const operacaoId = dto.pjesOperacaoId ?? escalaAtual.pjesOperacaoId;
      const operacao = await manager.findOne(PjesOperacaoEntity, {
        where: { id: operacaoId },
        relations: ['pjesescalas'],
      });

      if (!operacao) throw new NotFoundException('Operação não encontrada');

      const outrasEscalasMesmoTipo = operacao.pjesescalas.filter(
        (e) => e.id !== escalaAtual.id && e.tipoSgp?.toUpperCase() === tipoNovo,
      );

      const somaOutrasCotas = outrasEscalasMesmoTipo.reduce(
        (sum, e) => sum + e.ttCota,
        0,
      );

      const totalFuturo = somaOutrasCotas + novoTtCota;

      if (tipoNovo === 'O' && totalFuturo > operacao.ttCtOfOper) {
        throw new BadRequestException(
          `Atualização inválida: cotas para oficiais excederiam o limite (${totalFuturo} > ${operacao.ttCtOfOper}).`,
        );
      }

      if (tipoNovo === 'P' && totalFuturo > operacao.ttCtPrcOper) {
        throw new BadRequestException(
          `Atualização inválida: cotas para praças excederiam o limite (${totalFuturo} > ${operacao.ttCtPrcOper}).`,
        );
      }

      await this.verificarLimiteCotasPorMatricula(
        matSgp,
        dataInicio,
        novoTtCota,
        manager,
        id,
      );

      // 🔒 Remove pjesOperacaoId para garantir que não será alterado
      delete dto.pjesOperacaoId;

      await manager.update(PjesEscalaEntity, id, {
        ...dto,
        ttCota: novoTtCota,
      });

      return manager.findOne(PjesEscalaEntity, {
        where: { id },
        relations: ['pjesoperacao', 'pjesevento'],
      });
    });
  }

  async updateStatusEscala(
    id: number,
    dto: UpdateStatusPjesEscalaDto,
    user: LoginPayload,
  ): Promise<ReturnPjesEscalaDto> {
    const escala = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: ['pjesevento'], // 👈 necessário para acessar o status do evento
    });

    if (!escala) {
      throw new NotFoundException('Escala não encontrada');
    }

    // ✅ Verifica se o evento está homologado
    if (
      escala.pjesevento?.statusEvento === 'HOMOLOGADA' &&
      user.typeUser !== 1
    ) {
      throw new BadRequestException(
        'O Evento está homologado. Escala não pode ser modificada.',
      );
    }

    escala.statusEscala = dto.statusEscala;

    const saved = await this.pjesEscalaRepository.save(escala);

    return new ReturnPjesEscalaDto(saved);
  }

  async registrarObs(
    id: number,
    dto: UpdateObsPjesEscalaDto,
    user: LoginPayload,
  ): Promise<ReturnPjesEscalaDto> {
    const escala = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: ['pjesevento', 'userObs'],
    });

    if (!escala) {
      throw new NotFoundException('Escala não encontrada');
    }

    this.verificarPermissaoDeAcesso(escala.pjesevento, user);

    if (
      escala.pjesevento.statusEvento === 'HOMOLOGADA' &&
      user.typeUser !== 10
    ) {
      throw new BadRequestException(
        'Evento homologado. Não é possível alterar observação.',
      );
    }

    escala.obs = dto.obs;
    escala.userIdObs = user.id;
    escala.updatedObsAt = new Date();

    const updated = await this.pjesEscalaRepository.save(escala);

    return new ReturnPjesEscalaDto(updated);
  }

  async remove(id: number, user: LoginPayload): Promise<void> {
    const escala = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: ['pjesoperacao'],
    });

    if (!escala) {
      throw new NotFoundException('Escala não encontrada');
    }

    const operacao = escala.pjesoperacao;

    const evento = await this.pjesEventoRepository.findOne({
      where: { id: operacao.pjesEventoId },
      relations: ['pjesdist'],
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    this.verificarPermissaoDeAcesso(evento, user);

    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Evento homologado. Voce não pode excluir esse registro.',
      );
    }

    /*VERIFICAÇÃO SE O USER LOGADO É O MESMO PARA O QUAL FOI DESTINADO O EVENTO */
    /*EXCETO PARA: USUARIO MASTER E TECNICO*/
    this.verificarPermissaoDeAcesso(evento, user);

    await this.pjesEscalaRepository.delete(id);
  }
}
