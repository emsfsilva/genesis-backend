import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateUserDto } from './dtos/createUser.dto';
import { Delete, HttpCode } from '@nestjs/common';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { User } from 'src/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
@Roles(UserType.Master, UserType.Auxiliar)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUser: CreateUserDto,
    @User() loggedUser: LoginPayload,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.createUser(createUser, loggedUser);
    return new ReturnUserDto(user);
  }

  @Get()
  async getAllUser(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUser();
    return users.map((userEntity) => new ReturnUserDto(userEntity));
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    const user = await this.userService.findUserById(userId);
    return new ReturnUserDto(user);
  }

  @Patch('/:userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() updatedUser: Partial<CreateUserDto>,
    @User() loggedUser: LoginPayload,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.updateUser(
      userId,
      updatedUser,
      loggedUser,
    );
    return new ReturnUserDto(user);
  }

  @Delete('/:userId')
  @HttpCode(204)
  async deleteUser(
    @Param('userId')
    userId: number,
    @User() loggedUser: LoginPayload,
  ): Promise<void> {
    return this.userService.deleteUser(userId, loggedUser);
  }

  @Patch()
  async updatePasswordUser(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @UserId() userId: number,
    @User() loggedUser: LoginPayload,
  ) {
    return this.userService.updatePasswordUser(
      updatePasswordDTO,
      userId,
      loggedUser,
    );
  }

  @Patch('/reset-password/:userId')
  async resetPassword(
    @Param('userId') userId: number,
    @User() loggedUser: LoginPayload,
  ) {
    const user = await this.userService.resetPassword(userId, loggedUser);
    return { message: `Senha redefinida para o usuário ${user.loginSei}` };
  }
}
