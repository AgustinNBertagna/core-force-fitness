import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/helpers/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTrainers() {
    return await this.trainersService.getTrainers();
  }

  @Get('students')
  @Roles(Role.TRAINER)
  @UseGuards(AuthGuard, RolesGuard)
  async getStudents() {
    return await this.trainersService.getStudents();
  }

  @Get('students/:id')
  @Roles(Role.TRAINER)
  @UseGuards(AuthGuard, RolesGuard)
  async getTrainerStudents(@Param('id') id: string) {
    return await this.trainersService.getTrainerStudents(id);
  }

  @Post('students/:id')
  @Roles(Role.TRAINER)
  @UseGuards(AuthGuard, RolesGuard)
  async assignStudent(@Param('id') id: string, @Body('userId') userId: string) {
    return await this.trainersService.assignStudents(id, userId);
  }

  @Delete('routine/:id')
  @Roles(Role.TRAINER)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteRoutine(@Param('id') id: string) {
    return await this.trainersService.deleteRoutine(id);
  }

  @Post('students/routine/:id')
  @Roles(Role.TRAINER)
  @UseGuards(AuthGuard, RolesGuard)
  async assignRoutine(@Param('id') id: string, @Body('userId') userId: string) {
    return await this.trainersService.assignRoutine(id, userId);
  }
}
