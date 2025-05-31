import { IsString } from 'class-validator';

export class CreateTurma {
  @IsString()
  name: string;
}
