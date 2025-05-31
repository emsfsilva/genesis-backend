import { IsNumber } from 'class-validator';

export class CreateCaDTO {
  @IsNumber()
  userId: number;
}
