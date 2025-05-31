import { IsNumber } from 'class-validator';

export class CreateCmtciaDTO {
  @IsNumber()
  userId: number;
}
