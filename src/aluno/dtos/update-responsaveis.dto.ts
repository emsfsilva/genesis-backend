// src/aluno/dtos/update-responsaveis.dto.ts
import { IsNumber } from 'class-validator';

export class UpdateResponsaveisDTO {
  @IsNumber()
  resp1: number;

  @IsNumber()
  resp2: number;
}
