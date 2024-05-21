import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getStudents(id: string) {
    const trainer = await this.usersRepository.findOneBy({ id });
    if (!trainer) throw new NotFoundException('Trainer not found');
    const students = await this.usersRepository.findBy({ trainer });
    if (!students.length) throw new NotFoundException('Students not found');
    return students;
  }
}
