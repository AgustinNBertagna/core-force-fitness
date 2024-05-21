import { Controller, Get, Param } from '@nestjs/common';
import { TrainersService } from './trainers.service';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get('students/:id')
  async getStudents(@Param('id') id: string) {
    return await this.trainersService.getStudents(id);
  }
}
