import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Raw, Repository } from 'typeorm';
import { PjesEscalaEntity } from './entities/pjesescala.entity';
import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { CreatePjesEscalaDto } from './dtos/create-pjesescala.dto';
import { UpdatePjesEscalaDto } from './dtos/update-pjesescala.dto';
import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { OmeEntity } from 'src/ome/entities/ome.entity';

@Injectable()
export class PjesEscalaService {
  constructor(
    @InjectRepository(PjesEscalaEntity)
    private readonly pjesEscalaRepository: Repository<PjesEscalaEntity>,

    @InjectRepository(PjesEventoEntity)
    private readonly pjesEventoRepository: Repository<PjesEventoEntity>,

    @InjectRepository(OmeEntity)
    private readonly omeRepository: Repository<OmeEntity>,

    @InjectRepository(PjesOperacaoEntity)
    private readonly pjesOperacaoRepository: Repository<PjesOperacaoEntity>,
  ) {}

  private async verificarLimiteCotasPorMatricula(
    matSgp: number,
    dataInicio: Date,
    novaCota: number,
    escalaIdParaIgnorar?: number, // usado no update
  ): Promise<void> {
    const mes = dataInicio.getMonth() + 1;
    const ano = dataInicio.getFullYear();

    const queryBuilder = this.pjesEscalaRepository
      .createQueryBuilder('escala')
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

  async create(
    dto: CreatePjesEscalaDto,
    user: LoginPayload,
  ): Promise<PjesEscalaEntity> {
    const evento = await this.pjesEventoRepository.findOne({
      where: { id: dto.pjesEventoId },
      relations: ['pjesdist'],
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Evento homologada. Contate o Adminitrador.',
      );
    }

    const operacao = await this.pjesOperacaoRepository.findOne({
      where: { id: dto.pjesOperacaoId },
      relations: ['pjesescalas'],
    });

    if (!operacao) {
      throw new NotFoundException('Operação não encontrada');
    }

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
          `Limite de cotas para oficiais excedido: atual ${totalCotasOf}, novo ${ttCotaCalculado}, máximo ${operacao.ttCtOfOper}`,
        );
      }
    } else if (tipo === 'P') {
      const totalCotasPrc = escalasDaOperacao
        .filter((e) => e.tipoSgp?.toUpperCase() === 'P')
        .reduce((sum, e) => sum + e.ttCota, 0);

      if (totalCotasPrc + ttCotaCalculado > operacao.ttCtPrcOper) {
        throw new BadRequestException(
          `Limite de cotas para praças excedido: atual ${totalCotasPrc}, novo ${ttCotaCalculado}, máximo ${operacao.ttCtPrcOper}`,
        );
      }
    } else {
      throw new BadRequestException(`tipoSgp inválido. Use 'O' ou 'P'.`);
    }

    const ome = await this.omeRepository.findOne({
      where: { id: dto.omeId },
    });

    if (!ome) {
      throw new NotFoundException(`OME não encontrada com id: ${dto.omeId}`);
    }

    const existeEscalaMesmoMatData = await this.pjesEscalaRepository.findOne({
      where: {
        matSgp: dto.matSgp,
        dataInicio: dto.dataInicio,
      },
    });

    if (existeEscalaMesmoMatData) {
      throw new BadRequestException(
        `Já existe uma escala para o militar ${dto.matSgp} na data ${dto.dataInicio} na OME: ${ome.nomeOme}.`,
      );
    }

    await this.verificarLimiteCotasPorMatricula(
      dto.matSgp,
      dataInicio,
      ttCotaCalculado,
    );

    const escala = this.pjesEscalaRepository.create({
      ...dto,
      ttCota: ttCotaCalculado,
      dataFinal: dto.dataInicio,
    });

    const saved = await this.pjesEscalaRepository.save(escala);

    return this.pjesEscalaRepository.findOne({
      where: { id: saved.id },
      relations: ['pjesoperacao', 'pjesevento'],
    });
  }

  async findAll(): Promise<PjesEscalaEntity[]> {
    return await this.pjesEscalaRepository.find({
      relations: ['pjesoperacao', 'pjesevento', 'pjesevento.pjesdist'],
    });
  }

  async findOne(id: number): Promise<PjesEscalaEntity> {
    const escala = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: ['pjesoperacao', 'pjesevento', 'pjesevento.pjesdist'],
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
    // Busca a escala atual
    const escalaAtual = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: ['pjesoperacao'],
    });

    if (!escalaAtual) {
      throw new NotFoundException('Escala não encontrada');
    }

    // Busca OME
    const ome = await this.omeRepository.findOne({
      where: { id: dto.omeId },
    });

    if (!ome) {
      throw new NotFoundException(`OME não encontrada com id: ${dto.omeId}`);
    }

    // Determina o ID do evento (se novo foi enviado ou mantém o atual)
    const eventoId = dto.pjesEventoId ?? escalaAtual.pjesEventoId;

    const evento = await this.pjesEventoRepository.findOne({
      where: { id: eventoId },
      relations: ['pjesdist'],
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Evento homologado. Contate o Adminitrador.',
      );
    }

    // Trata data de início
    const dataInicioStr = dto.dataInicio ?? escalaAtual.dataInicio;
    const dataInicioVerificar = new Date(dataInicioStr);

    if (isNaN(dataInicioVerificar.getTime())) {
      throw new BadRequestException('Data de início inválida');
    }

    const mes = dataInicioVerificar.getMonth() + 1;
    const ano = dataInicioVerificar.getFullYear();

    if (mes !== evento.mes || ano !== evento.ano) {
      throw new BadRequestException(
        'A nova data de início não corresponde ao mês/ano do evento.',
      );
    }

    // Verifica matrícula a ser usada
    const matSgpVerificar = dto.matSgp ?? escalaAtual.matSgp;
    const dataInicioFormatada = dataInicioVerificar.toISOString().slice(0, 10);

    const existeOutraEscalaMesmoMilitarMesmoDia =
      await this.pjesEscalaRepository.findOne({
        where: {
          matSgp: matSgpVerificar,
          dataInicio: Raw(
            (alias) => `${alias} = DATE '${dataInicioFormatada}'`,
          ),
          id: Not(id),
        },
      });

    if (existeOutraEscalaMesmoMilitarMesmoDia) {
      throw new BadRequestException(
        `Militar ${matSgpVerificar} já possui uma escala em ${dataInicioFormatada} na OME: ${ome.nomeOme}.`,
      );
    }

    // Define horaInicio e horaFinal
    const horaInicio = dto.horaInicio ?? escalaAtual.horaInicio;
    const horaFinal = dto.horaFinal ?? escalaAtual.horaFinal;

    // Calcula nova cota
    const novoTtCota = horaInicio === horaFinal ? 2 : 1;

    // Atualiza ttCota temporariamente (pode ser usado em outras validações)
    escalaAtual.ttCota = novoTtCota;

    // Verifica tipo de militar
    const tipoNovo = (dto.tipoSgp ?? escalaAtual.tipoSgp)?.toUpperCase();
    if (tipoNovo !== 'O' && tipoNovo !== 'P') {
      throw new BadRequestException(`tipoSgp inválido. Use 'O' ou 'P'.`);
    }

    // Busca operação
    const operacaoId = dto.pjesOperacaoId ?? escalaAtual.pjesOperacaoId;
    const operacao = await this.pjesOperacaoRepository.findOne({
      where: { id: operacaoId },
      relations: ['pjesescalas'],
    });

    if (!operacao) {
      throw new NotFoundException('Operação não encontrada');
    }

    // Cotas já utilizadas (exceto a escala atual)
    const outrasEscalasMesmoTipo = operacao.pjesescalas.filter(
      (e) => e.id !== escalaAtual.id && e.tipoSgp?.toUpperCase() === tipoNovo,
    );

    const somaCotasOutras = outrasEscalasMesmoTipo.reduce(
      (sum, e) => sum + e.ttCota,
      0,
    );

    const totalFuturo = somaCotasOutras + novoTtCota;

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
      matSgpVerificar,
      dataInicioVerificar,
      novoTtCota,
      id, // ignora a escala atual
    );

    // Atualiza a escala no banco
    await this.pjesEscalaRepository.update(id, {
      ...dto,
      ttCota: novoTtCota,
    });

    // Retorna a escala atualizada
    return this.findOne(id);
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

    await this.pjesEscalaRepository.delete(id);
  }
}
