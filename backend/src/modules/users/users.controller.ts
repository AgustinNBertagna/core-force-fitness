import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/helpers/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { userWithoutPasswordDto } from 'src/dtos/user-without-password.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @HttpCode(200)
  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    // @Query('page') page: number = 1,
    // @Query('limit') limit: number = 5,
    @Query('userType') userType: string = 'user',
    @Query('membership') membership: string = 'all',
    @Query('gender') gender: string = 'all',
  ): Promise<Partial<User>[]> {
    // page,
    // limit,
    return await this.userServices.getUsers(userType, membership, gender);
  }

  //REFACTORIZAR URGENTE AGUSTIN (MANEJO DE ERRORES 😡)

  @Get('email')
  async getUserByEmail(
    @Query('email') email: string,
  ): Promise<userWithoutPasswordDto> {
    return await this.userServices.getUserByEmail(email);
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<User, 'password'>> {
    return await this.userServices.getUserById(String(id));
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: Partial<UpdateUserDto>,
  ): Promise<string> {
    return await this.userServices.updateUserById(id, updateUser);
  }

  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async deleteUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    return await this.userServices.deleteUserById(id);
  }

  @Put('logicaldelete/:id')
  @UseGuards(AuthGuard)
  async logicalDelete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.userServices.logicalDelete(id);
  }
}
