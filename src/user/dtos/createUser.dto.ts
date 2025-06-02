import { IsString, IsEnum, IsNumber } from 'class-validator';
import { UserType } from '../enum/user-type.enum';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  pg: string;

  @IsNumber()
  mat: number;

  @IsString()
  nomeGuerra: string;

  @IsNumber()
  omeId: number;

  @IsString()
  phone: string;

  @IsString()
  funcao: string;

  @IsEnum(UserType)
  typeUser: UserType;
}
