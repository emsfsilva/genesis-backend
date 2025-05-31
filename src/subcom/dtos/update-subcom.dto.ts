import { IsNumber } from 'class-validator';

export class UpdateSubcomDTO {
  @IsNumber()
  userId: number;
}
