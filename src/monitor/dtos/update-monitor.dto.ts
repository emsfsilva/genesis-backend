import { IsNumber } from 'class-validator';

export class UpdateMonitorDTO {
  @IsNumber()
  userId: number;
}
