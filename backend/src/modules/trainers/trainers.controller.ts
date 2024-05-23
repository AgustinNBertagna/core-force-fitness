import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

  @Get('students/:id')
  @Roles(Role.TRAINER)
  @UseGuards(AuthGuard, RolesGuard)
  async getStudents(@Param('id') id: string) {
    return await this.trainersService.getStudents(id);
  }
}
