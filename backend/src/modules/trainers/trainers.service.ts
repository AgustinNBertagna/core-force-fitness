import { Injectable } from '@nestjs/common';
import { CreateTrainerDto } from '../../dtos/create-trainer.dto';
import { UpdateTrainerDto } from '../../dtos/update-trainer.dto';

@Injectable()
export class TrainersService {
  create(createTrainerDto: CreateTrainerDto) {
    console.log(createTrainerDto); //borrar

    return 'This action adds a new trainer';
  }

  findAll() {
    return `This action returns all trainers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainer`;
  }

  update(id: number, updateTrainerDto: UpdateTrainerDto) {
    console.log(updateTrainerDto); //borrar

    return `This action updates a #${id} trainer`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainer`;
  }
}
