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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @HttpCode(200)
  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UseGuards(AuthGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<Partial<User>[]> {
    return await this.userServices.getUsers(page, limit);
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
}
