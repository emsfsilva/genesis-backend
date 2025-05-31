import {
  Controller,
  Request,
  Post,
  Body,
  Param,
  Put,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ComunicacaoService } from './comunicacao.service';
import { CreateComunicacaoDTO } from './dtos/create-comunicacao.dto';
import { ReturnComunicacaoDTO } from './dtos/return-comunicacao.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EnquadramentoDto } from './dtos/enquadramento.dto';
import { ArquivamentoDto } from './dtos/arquivamento.dto';

@Controller('comunicacao')
//@UseGuards(JwtAuthGuard) // Protege todas as rotas com o guard
export class ComunicacaoController {
  constructor(private readonly comunicacaoService: ComunicacaoService) {}

  @Get('/comunicacao-concluidas')
  async contarEmConcluidas() {
    return this.comunicacaoService.contarComunicacoesConcluidas();
  }

  @Get('/comunicacao-publicadas')
  async contarPublicadas() {
    return this.comunicacaoService.contarComunicacoesPublicadas();
  }

  @Get('/comunicacao-aguardando-publicacao')
  async contarAguardandoPublicacao() {
    return this.comunicacaoService.contarComunicacoesAguardandoPublicacao();
  }

  @Get('/contar-em-tramitacao')
  async contarEmTramitacao() {
    return this.comunicacaoService.contarComunicacoesEmTramitacao();
  }

  // Endpoint para contar comunicações por status filtrando por CIA
  @Get('/contar-status-cia')
  async contarPorStatusPorCia() {
    return this.comunicacaoService.contarComunicacoesPorStatusPorCia();
  }

  // Endpoint para contar comunicações APENAS por CIA
  @Get('/contar-cia')
  async contarPorPorCia() {
    return this.comunicacaoService.contarComunicacoesPorCia();
  }

  // Endpoint para criar uma comunicação
  @Post('criar')
  async criarComunicacao(
    @Body() createComunicacaoDTO: CreateComunicacaoDTO, // DTO de criação da comunicação
    @Query('userIdCom') userIdCom: number, // Captura o userIdCom da query string
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.criarComunicacao(
      createComunicacaoDTO,
      userIdCom,
    );
  }

  // Endpoint para notificar o aluno para responder a comunicação
  @Put('aguardando-resposta/:comunicacaoId')
  async atualizarStatusParaAguardandoRespostaDoAluno(
    @Param('comunicacaoId') comunicacaoId: number,
    @Body() body: EnquadramentoDto,
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.atualizarStatusParaAguardandoRespostaDoAluno(
      comunicacaoId,
      body.grauMotivo,
      body.enquadramento,
      body.natureza,
    );
  }

  // Endpoint para responder a comunicação (useral)
  @Put('responder/:comunicacaoId')
  async responderComunicacao(
    @Param('comunicacaoId') comunicacaoId: number, // ID da comunicação que está sendo respondida
    @Body('resposta') resposta: string, // Resposta fornecida por useral
    //@Query('userIdCom') userIdCom: number, // Captura o userIdCom da query string
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.responderComunicacao(
      comunicacaoId,
      resposta,
      //userIdCom,
    );
  }

  // Endpoint para enviar ao cmt da Cia
  @Put('enviar-cmtcia/:comunicacaoId')
  async atualizarStatusParaEnviarAoCmtdaCia(
    @Param('comunicacaoId') comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.atualizarStatusParaEnviarAoCmtdaCia(
      comunicacaoId,
    );
  }

  // Endpoint para adicionar a opinião final (userSup)
  @Put('opinioes/:comunicacaoId')
  async adicionarParecerCmtCia(
    @Param('comunicacaoId') comunicacaoId: number, // ID da comunicação que receberá a opinião final
    @Body('parecerCmtCia') parecerCmtCia: string, // A opinião final fornecida por userSup
    @Body('userIdCmtCia') userIdCmtCia: number, // ID do usuário que dará a opinião final (userSup)
  ): Promise<ReturnComunicacaoDTO> {
    // Chama o serviço para adicionar a opinião final e retorna a resposta
    return this.comunicacaoService.adicionarParecerCmtCia(
      comunicacaoId,
      parecerCmtCia,
      userIdCmtCia,
    );
  }

  // Endpoint para adicionar a opinião final (userSup)
  @Put('parecerca/:comunicacaoId')
  async adicionarParecerCa(
    @Param('comunicacaoId') comunicacaoId: number,
    @Body('parecerCa') parecerCa: string,
    @Body('userIdCa') userIdCa: number,
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.adicionarParecerCa(
      comunicacaoId,
      parecerCa,
      userIdCa,
    );
  }

  // Endpoint para adicionar o parecer do SubComando
  @Put('parecersubcom/:comunicacaoId')
  async adicionarParecerSubcom(
    @Param('comunicacaoId') comunicacaoId: number,
    @Body('parecerSubcom') parecerSubcom: string,
    @Body('userIdSubcom') userIdSubcom: number,
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.adicionarParecerSubcom(
      comunicacaoId,
      parecerSubcom,
      userIdSubcom,
    );
  }

  // Endpoint para publicar a comunicação
  @Put('publicar/:comunicacaoId')
  async publicarComunicacao(
    @Param('comunicacaoId') comunicacaoId: number, // ID da comunicação que será publicada
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.publicarComunicacao(comunicacaoId);
  }

  // Endpoint para buscar todas as comunicações
  @Get()
  async buscarTodasComunicacoes(
    @Request() req: any, // O usuário estará disponível aqui através do `request.user`
  ): Promise<ReturnComunicacaoDTO[]> {
    //const user = req.user;
    //console.log('Os dados do usaurio são: ', user); // Acessando os dados do usuário
    return this.comunicacaoService.buscarTodasComunicacoes();
  }

  @Get('/:comunicacaoId')
  async getComunicacaoById(
    @Param('comunicacaoId') comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.findComunicacaoById(comunicacaoId);
  }

  // Endpoint para buscar todas as comunicações de um aluno
  @Get('aluno/:userIdAl')
  async getComunicacoesByAlunoUserId(
    @Param('userIdAl') userIdAl: number,
  ): Promise<ReturnComunicacaoDTO[]> {
    return this.comunicacaoService.findComunicacoesByAlunoUserId(userIdAl);
  }

  // Endpoint para arquivar a comunicação
  @Put('arquivar/:comunicacaoId')
  async arquivarComunicacao(
    @Param('comunicacaoId') comunicacaoId: number,
    @Body() body: ArquivamentoDto,
  ): Promise<ReturnComunicacaoDTO> {
    return this.comunicacaoService.arquivarComunicacao(
      comunicacaoId,
      body.motivoArquivamento,
      body.userIdArquivamento,
    );
  }
}
