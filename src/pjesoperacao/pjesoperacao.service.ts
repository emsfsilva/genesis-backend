import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesOperacaoEntity } from './entities/pjesoperacao.entity';
import { CreatePjesOperacaoDto } from './dtos/create-pjesoperacao.dto';
import { ReturnPjesOperacaoDto } from './dtos/return-pjesoperacao.dto';
import { BadRequestException } from '@nestjs/common';
import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { UpdateStatusPjesOperacaoDto } from './dtos/update-status-pjesoperacao.dto';

@Injectable()
export class PjesOperacaoService {
  constructor(
    @InjectRepository(PjesEventoEntity)
    private readonly pjesEventoRepository: Repository<PjesEventoEntity>,

    @InjectRepository(PjesOperacaoEntity)
    private readonly pjesOperacaoRepository: Repository<PjesOperacaoEntity>,
  ) {}

  async create(
    dto: CreatePjesOperacaoDto,
    user: LoginPayload,
  ): Promise<ReturnPjesOperacaoDto> {
    // Carrega o evento relacionado
    const evento = await this.pjesOperacaoRepository.manager
      .getRepository(PjesEventoEntity)
      .findOne({
        where: { id: dto.pjesEventoId },
        relations: ['pjesoperacoes'],
      });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    // 🔒 Validação de permissão
    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException('Evento homologado. Contate Adminitrador');
    }

    // Soma as distribuições já feitas
    const totalOficiaisDistribuidos =
      evento.pjesoperacoes?.reduce((sum, op) => sum + op.ttCtOfOper, 0) ?? 0;

    const totalPracasDistribuidos =
      evento.pjesoperacoes?.reduce((sum, op) => sum + op.ttCtPrcOper, 0) ?? 0;

    // Checa os limites
    if (totalOficiaisDistribuidos + dto.ttCtOfOper > evento.ttCtOfEvento) {
      throw new BadRequestException(
        `Uso das cotas de Oficiais excede o estabelecido pelo Evento`,
      );
    }

    if (totalPracasDistribuidos + dto.ttCtPrcOper > evento.ttCtPrcEvento) {
      throw new BadRequestException(
        `Uso das cotas das praças excede o estabelecido pelo Evento`,
      );
    }

    // Se tudo ok, cria
    const entity = this.pjesOperacaoRepository.create({
      ...dto,
      codVerba: evento.codVerba,
    });
    const saved = await this.pjesOperacaoRepository.save(entity);

    // Recarrega com relação `ome` incluída
    const withRelations = await this.pjesOperacaoRepository.findOne({
      where: { id: saved.id },
      relations: ['ome'],
    });

    return new ReturnPjesOperacaoDto(withRelations);
  }

  async findAll(): Promise<ReturnPjesOperacaoDto[]> {
    const operations = await this.pjesOperacaoRepository.find({
      relations: ['ome', 'pjesevento', 'pjesescalas'],
    });
    return operations.map((op) => new ReturnPjesOperacaoDto(op));
  }

  async findOne(id: number): Promise<ReturnPjesOperacaoDto> {
    const operation = await this.pjesOperacaoRepository.findOne({
      where: { id },
      relations: ['pjesevento', 'pjesescalas'],
    });

    if (!operation) throw new NotFoundException('Operação não encontrada');

    return new ReturnPjesOperacaoDto(operation);
  }

  async remove(id: number, user: LoginPayload): Promise<void> {
    const operation = await this.pjesOperacaoRepository.findOne({
      where: { id },
      relations: ['pjesevento', 'pjesescalas'], // atenção aqui: 'pjesescalas'
    });

    if (!operation) {
      throw new NotFoundException('Operação não encontrada');
    }

    const evento = await this.pjesEventoRepository.findOne({
      where: { id: operation.pjesEventoId },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    // Impede exclusão se evento estiver homologado e o usuário não for do tipo 10
    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Evento homologado. Exclusão não permitida.',
      );
    }

    // 🚫 Impede exclusão se houver escalas associadas e o usuário não for tipo 5 ou 10
    if (
      operation.pjesescalas &&
      operation.pjesescalas.length > 0 &&
      ![5, 10].includes(user.typeUser)
    ) {
      throw new BadRequestException(
        'Não é permitido excluir operações com policiais já escalados.',
      );
    }

    await this.pjesOperacaoRepository.remove(operation);
  }

  async updateStatusOperacao(
    id: number,
    dto: UpdateStatusPjesOperacaoDto,
    user: LoginPayload,
  ): Promise<ReturnPjesOperacaoDto> {
    const operacao = await this.pjesOperacaoRepository.findOne({
      where: { id },
      relations: ['pjesevento', 'ome'],
    });

    if (!operacao) {
      throw new NotFoundException('Operacao não encontrado');
    }

    const evento = operacao.pjesevento;

    if (!evento) {
      throw new NotFoundException('Distribuição do evento não encontrada');
    }

    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Operacao pertencente a um evento homologado. Alteração não permitida.',
      );
    }

    operacao.statusOperacao = dto.statusOperacao;
    const saved = await this.pjesOperacaoRepository.save(operacao);

    return new ReturnPjesOperacaoDto(saved);
  }

  async update(
    id: number,
    dto: CreatePjesOperacaoDto,
    user: LoginPayload,
  ): Promise<ReturnPjesOperacaoDto> {
    const existing = await this.pjesOperacaoRepository.findOne({
      where: { id },
      relations: ['pjesevento'],
    });

    const evento = await this.pjesOperacaoRepository.manager
      .getRepository(PjesEventoEntity)
      .findOne({
        where: { id: existing.pjesevento.id },
        relations: ['pjesoperacoes'],
      });

    if (!evento) throw new NotFoundException('Evento não encontrado');

    if (evento.statusEvento === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Atualização inválida: Evento homologado. Contate o administrador.',
      );
    }

    // Soma das distribuições, exceto a atual
    const totalOficiaisDistribuidos = evento.pjesoperacoes
      .filter((op) => op.id !== id)
      .reduce((sum, op) => sum + op.ttCtOfOper, 0);

    const totalPracasDistribuidos = evento.pjesoperacoes
      .filter((op) => op.id !== id)
      .reduce((sum, op) => sum + op.ttCtPrcOper, 0);

    const novaSomaOficiais = totalOficiaisDistribuidos + dto.ttCtOfOper;
    const novaSomaPracas = totalPracasDistribuidos + dto.ttCtPrcOper;

    if (novaSomaOficiais > evento.ttCtOfEvento) {
      throw new BadRequestException(
        `Atualização inválida: Uso das cotas de Oficiais excede o estabelecido pelo Evento`,
      );
    }

    if (novaSomaPracas > evento.ttCtPrcEvento) {
      throw new BadRequestException(
        `Atualização inválida: Uso das cotas das Praças excede o estabelecido pelo Evento`,
      );
    }

    // Carrega as escalas da operação atual para validar o consumo real
    const operacaoExistente = await this.pjesOperacaoRepository.findOne({
      where: { id },
      relations: ['pjesescalas'],
    });

    if (!operacaoExistente) {
      throw new NotFoundException('Operação não encontrada');
    }

    // ✅ Impede troca de teto
    if (dto.pjesEventoId && dto.pjesEventoId !== existing.pjesEventoId) {
      throw new BadRequestException(
        'Não é permitido alterar o tipo da verba ja criada.',
      );
    }

    // Soma real de cotas consumidas já lançadas em escalas
    const cotasConsumidasOficiais = operacaoExistente.pjesescalas
      .filter((escala) => escala.tipoSgp?.toUpperCase() === 'O')
      .reduce((sum, escala) => sum + escala.ttCota, 0);

    const cotasConsumidasPracas = operacaoExistente.pjesescalas
      .filter((escala) => escala.tipoSgp?.toUpperCase() === 'P')
      .reduce((sum, escala) => sum + escala.ttCota, 0);

    // Valida se o novo valor é menor do que o já consumido
    if (dto.ttCtOfOper < cotasConsumidasOficiais) {
      throw new BadRequestException(
        `Não é possível reduzir cotas de Oficiais. Já foram consumidas nas escalas.`,
      );
    }

    if (dto.ttCtPrcOper < cotasConsumidasPracas) {
      throw new BadRequestException(
        `Não é possível reduzir cotas de Praças. Já foram consumidas nas escalas.`,
      );
    }

    // 🔒 Remove pjesEventoId para garantir que não será alterado
    delete dto.pjesEventoId;

    const updated = this.pjesOperacaoRepository.merge(existing, dto);
    const saved = await this.pjesOperacaoRepository.save(updated);
    //return new ReturnPjesOperacaoDto(saved);
    // Recarrega com relação `ome` incluída
    const withRelations = await this.pjesOperacaoRepository.findOne({
      where: { id: saved.id },
      relations: ['ome'],
    });

    return new ReturnPjesOperacaoDto(withRelations);
  }
}
