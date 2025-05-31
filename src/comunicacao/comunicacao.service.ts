import { Injectable, NotFoundException } from '@nestjs/common';
import { ComunicacaoEntity } from './entities/comunicacao.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComunicacaoDTO } from './dtos/create-comunicacao.dto';
import { ReturnComunicacaoDTO } from './dtos/return-comunicacao.dto';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AlunoService } from 'src/aluno/aluno.service';

import { In } from 'typeorm';

@Injectable()
export class ComunicacaoService {
  constructor(
    @InjectRepository(ComunicacaoEntity)
    private readonly comunicacaoRepository: Repository<ComunicacaoEntity>,

    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    private readonly alunoService: AlunoService,
  ) {}

  // Função para buscar todas as comunicações
  async buscarTodasComunicacoes(): Promise<ReturnComunicacaoDTO[]> {
    const comunicacoes = await this.comunicacaoRepository.find({
      relations: {
        useral: {
          aluno: {
            turma: {
              cia: true,
            },
          },
        },
        usercom: true,
        usercmtcia: true,
        userca: true,
        usersubcom: true,
      },
    });
    return comunicacoes.map(
      (comunicacao) => new ReturnComunicacaoDTO(comunicacao),
    );
  }
  // Função para buscar comunicações por id
  async findComunicacaoById(
    comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: {
        id: comunicacaoId,
      },
      relations: {
        useral: {
          aluno: {
            turma: {
              cia: true,
            },
            responsavel1: true,
            responsavel2: true,
          },
        },
        usercom: true,
        usercmtcia: true,
        userca: true,
        usersubcom: true,
        userarquivador: true,
      },
    });

    if (!comunicacao) {
      throw new NotFoundException(
        `Comunicacao id: ${comunicacaoId} Não Encontrado`,
      );
    }

    if (comunicacao.useral?.aluno) {
      const grauAtual = await this.alunoService.calcularGrauAtual(
        comunicacao.useral.id,
      );
      (comunicacao.useral.aluno as any).grauAtual = grauAtual;
    }

    // Retorna o aluno como um DTO
    return new ReturnComunicacaoDTO(comunicacao);
  }
  // Função para buscar comunicações por id do Aluno
  async findComunicacoesByAlunoUserId(
    userIdAl: number,
  ): Promise<ReturnComunicacaoDTO[]> {
    const statusPermitidos = [
      'Aguardando resposta do aluno',
      'Aguardando enviar ao Cmt da Cia',
      'Comunicação arquivada',
      'Aguardando parecer do Cmt da Cia',
      'Aguardando parecer do Cmt do CA',
      'Aguardando parecer do Subcomando',
      'Aguardando publicação',
      'Comunicação publicada',
    ];

    const comunicacoes = await this.comunicacaoRepository.find({
      where: {
        userIdAl,
        status: In(statusPermitidos), // <- agora direto!
      },
      relations: {
        useral: true,
        usercom: true,
        usercmtcia: true,
        userca: true,
        usersubcom: true,
      },
      order: { dataCom: 'DESC' },
    });

    return comunicacoes.map(
      (comunicacao) => new ReturnComunicacaoDTO(comunicacao),
    );
  }

  async contarComunicacoesConcluidas(): Promise<number> {
    const comunicacoesConcluidas = await this.comunicacaoRepository.count({
      where: {
        status: In(['Comunicação arquivada', 'Comunicação publicada']),
      },
    });

    return comunicacoesConcluidas;
  }

  async contarComunicacoesPublicadas(): Promise<number> {
    const comunicacoesPublicadas = await this.comunicacaoRepository.count({
      where: {
        status: In(['Comunicação publicada']),
      },
    });

    return comunicacoesPublicadas;
  }

  async contarComunicacoesAguardandoPublicacao(): Promise<number> {
    const comunicacoesAguardandoPublicacao =
      await this.comunicacaoRepository.count({
        where: {
          status: In(['Aguardando publicação']),
        },
      });

    return comunicacoesAguardandoPublicacao;
  }

  async contarComunicacoesEmTramitacao(): Promise<number> {
    const comunicacoesEmTramitacao = await this.comunicacaoRepository.count({
      where: {
        status: In([
          'Aguardando notificar aluno',
          'Aguardando resposta do aluno',
          'Aguardando enviar ao Cmt da Cia',
          'Aguardando parecer do Cmt da Cia',
          'Aguardando parecer do Cmt do CA',
          'Aguardando parecer do Subcomando',
          'Aguardando publicação',
        ]),
      },
    });

    return comunicacoesEmTramitacao;
  }

  //inicio Função para contar as comunicações da CIA pelo status
  async contarComunicacoesPorStatusPorCia(): Promise<any> {
    const comunicacoes = await this.comunicacaoRepository.find({
      relations: [
        'useral',
        'useral.aluno',
        'useral.aluno.turma',
        'useral.aluno.turma.cia',
      ],
    });

    const resultado = {};

    for (const comunicacao of comunicacoes) {
      const ciaName = comunicacao.useral?.aluno?.turma?.cia?.name || 'Sem CIA';
      const status = comunicacao.status;

      if (!resultado[ciaName]) {
        resultado[ciaName] = {};
      }

      if (!resultado[ciaName][status]) {
        resultado[ciaName][status] = 0;
      }

      resultado[ciaName][status]++;
    }

    return resultado;
  }

  //inicio Função para contar as comunicações APENAS por CIA
  async contarComunicacoesPorCia(): Promise<Record<string, number>> {
    const comunicacoes = await this.comunicacaoRepository.find({
      relations: [
        'useral',
        'useral.aluno',
        'useral.aluno.turma',
        'useral.aluno.turma.cia',
      ],
    });

    const resultado: Record<string, number> = {};

    for (const comunicacao of comunicacoes) {
      const ciaName = comunicacao.useral?.aluno?.turma?.cia?.name || 'Sem CIA';

      if (!resultado[ciaName]) {
        resultado[ciaName] = 0;
      }

      resultado[ciaName]++;
    }

    return resultado;
  }

  // Função para criar uma comunicação inicial
  async criarComunicacao(
    createComunicacaoDTO: CreateComunicacaoDTO,
    userIdCom: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = new ComunicacaoEntity();
    comunicacao.userIdCom = userIdCom;
    comunicacao.motivo = createComunicacaoDTO.motivo;
    comunicacao.grauMotivo = null;
    comunicacao.enquadramento = null;
    comunicacao.descricaoMotivo = createComunicacaoDTO.descricaoMotivo;
    comunicacao.natureza = null;
    comunicacao.dataCom = new Date();
    comunicacao.userIdAl = createComunicacaoDTO.userIdAl;
    comunicacao.resposta = null;
    comunicacao.dataResp = null;
    comunicacao.userIdCmtCia = null;
    comunicacao.parecerCmtCia = null;
    comunicacao.dataParecerCmtCia = null;

    comunicacao.userIdCa = null;
    comunicacao.parecerCa = null;
    comunicacao.dataParecerCa = null;

    comunicacao.userIdSubcom = null;
    comunicacao.parecerSubcom = null;
    comunicacao.dataParecerSubcom = null;

    comunicacao.status = 'Aguardando notificar aluno';
    comunicacao.dtAtualizacaoStatus = new Date();

    const savedComunicacao = await this.comunicacaoRepository.save(comunicacao);
    return new ReturnComunicacaoDTO(savedComunicacao);
  }

  //Função Enquadramento serve para atualuzar o grauMotivo e notificar o aluno a responder a comunicacao
  async atualizarStatusParaAguardandoRespostaDoAluno(
    comunicacaoId: number,
    grauMotivo: number,
    enquadramento: string,
    natureza: string,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });
    if (!comunicacao) {
      throw new NotFoundException('Comunicação não encontrada');
    }
    comunicacao.grauMotivo = grauMotivo;
    comunicacao.status = 'Aguardando resposta do aluno';
    comunicacao.enquadramento = enquadramento;
    comunicacao.natureza = natureza;
    comunicacao.dtAtualizacaoStatus = new Date();
    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para o aluno responder à comunicação
  async responderComunicacao(
    comunicacaoId: number,
    resposta: string,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.resposta = resposta;
    comunicacao.dataResp = new Date();
    comunicacao.status = 'Aguardando enviar ao Cmt da Cia';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  //Função para enviar ao cmt da cia
  async atualizarStatusParaEnviarAoCmtdaCia(
    comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });
    if (!comunicacao) {
      throw new NotFoundException('Comunicação não encontrada');
    }
    comunicacao.status = 'Aguardando parecer do Cmt da Cia';
    comunicacao.dtAtualizacaoStatus = new Date();
    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para adicionar o parecer do Cmt da Cia
  async adicionarParecerCmtCia(
    comunicacaoId: number,
    parecerCmtCia: string,
    userIdCmtCia: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.parecerCmtCia = parecerCmtCia;
    comunicacao.userIdCmtCia = userIdCmtCia;
    comunicacao.dataParecerCmtCia = new Date();
    comunicacao.status = 'Aguardando parecer do Cmt do CA';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para adicionar o parecer do Cmt da CA
  async adicionarParecerCa(
    comunicacaoId: number,
    parecerCa: string,
    userIdCa: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.parecerCa = parecerCa;
    comunicacao.userIdCa = userIdCa;
    comunicacao.dataParecerCa = new Date();
    comunicacao.status = 'Aguardando parecer do Subcomando';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para adicionar o parecer do Subcomando
  async adicionarParecerSubcom(
    comunicacaoId: number,
    parecerSubcom: string,
    userIdSubcom: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.parecerSubcom = parecerSubcom;
    comunicacao.userIdSubcom = userIdSubcom;
    comunicacao.dataParecerSubcom = new Date();
    comunicacao.status = 'Aguardando publicação';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Inicio Função para publicar a comunicação
  async publicarComunicacao(
    comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    // Atualizando o status para "Comunicacao Publicada"
    comunicacao.status = 'Comunicação publicada';

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );

    // Buscando o aluno
    const aluno = await this.alunoRepository.findOne({
      where: { userId: comunicacao.userIdAl },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    return new ReturnComunicacaoDTO(updatedComunicacao);
  }
  // Fim Função para publicar a comunicação

  // Inicio Função para Arquivar a comunicação
  async arquivarComunicacao(
    comunicacaoId: number,
    motivoArquivamento: string,
    userIdArquivamento: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new NotFoundException('Comunicação não encontrada');
    }

    comunicacao.status = 'Comunicação arquivada';
    comunicacao.motivoArquivamento = motivoArquivamento;
    comunicacao.userIdArquivamento = userIdArquivamento;
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }
  // Fim Função para Arquivar a comunicação
}
