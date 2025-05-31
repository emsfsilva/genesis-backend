import { IsNumber } from 'class-validator';

export class UpdateCaDTO {
  @IsNumber()
  userId: number;
}
