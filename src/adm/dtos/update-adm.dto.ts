import { IsNumber } from 'class-validator';

export class UpdateAdmDTO {
  @IsNumber()
  userId: number;
}
