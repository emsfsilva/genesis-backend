import { IsNumber } from 'class-validator';

export class UpdateCmtciaDTO {
  @IsNumber()
  userId: number;
}
