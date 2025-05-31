import { IsNumber } from 'class-validator';

export class CreateAlunoDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  resp1: number;

  @IsNumber()
  resp2: number;

  @IsNumber()
  grauInicial: number;

  @IsNumber()
  turmaId: number;
}
