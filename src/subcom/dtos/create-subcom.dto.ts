import { IsNumber } from 'class-validator';

export class CreateSubcomDTO {
  @IsNumber()
  userId: number;
}
