import { DiretoriaEntity } from '../entities/diretoria.entity';

export class ReturnDiretoriaDto {
  id: number;
  nomeDiretoria: string;

  constructor(diretoria: DiretoriaEntity) {
    this.id = diretoria.id;
    this.nomeDiretoria = diretoria.nomeDiretoria;
  }
}
