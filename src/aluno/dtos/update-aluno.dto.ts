import { IsNumber, IsString } from 'class-validator';

export class UpdateAlunoDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  resp1: number;

  @IsNumber()
  resp2: number;

  @IsNumber()
  turmaId: number;
}
