import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateUserDto } from './dtos/createUser.dto';
import { Delete, HttpCode } from '@nestjs/common';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';

@Controller('user')
/*@Roles(
  UserType.Master,
  UserType.Comando,
  UserType.CmtCa,
  UserType.CmtCia,
  UserType.Adm,
  UserType.Monitor,
  UserType.Aluno,
)
@UsePipes(ValidationPipe)
*/
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // Agora retornamos um ReturnUserDto em vez de UserEntity
  async createUser(@Body() createUser: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.userService.createUser(createUser);
    return new ReturnUserDto(user); // Retorna o DTO adequado
  }

  @Get()
  async getAllUser(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUser();
    return users.map((userEntity) => new ReturnUserDto(userEntity)); // Transforma todos em ReturnUserDto
  }

  @Patch('/:userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() updatedUser: Partial<CreateUserDto>,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.updateUser(userId, updatedUser);
    return new ReturnUserDto(user);
  }

  @Delete('/:userId')
  @HttpCode(204)
  async deleteUser(@Param('userId') userId: number): Promise<void> {
    return this.userService.deleteUser(userId);
  }

  @Patch()
  async updatePasswordUser(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @UserId() userId: number,
  ) {
    return this.userService.updatePasswordUser(updatePasswordDTO, userId);
  }

  @Patch('/reset-password/:userId')
  async resetPassword(@Param('userId') userId: number) {
    const user = await this.userService.resetPassword(userId);
    return { message: `Senha redefinida para o usuário ${user.email}` };
  }
}
