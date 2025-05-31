import { IsString } from 'class-validator';

export class CreateCia {
  @IsString()
  name: string;
}
