import { IsNumber } from 'class-validator';

export class CreateAdmDTO {
  @IsNumber()
  userId: number;
}
