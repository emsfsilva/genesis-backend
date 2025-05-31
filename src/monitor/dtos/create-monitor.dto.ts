import { IsNumber } from 'class-validator';

export class CreateMonitorDTO {
  @IsNumber()
  userId: number;
}
