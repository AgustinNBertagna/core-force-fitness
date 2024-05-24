import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/helpers/roles.enum';
import { Not, Repository } from 'typeorm';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getTrainers() {
    const trainers = await this.usersRepository.findBy({ role: Role.TRAINER });
    if (!trainers.length) throw new NotFoundException('Trainers not found');
    return trainers;
  }

  async getStudents() {
    const students = await this.usersRepository.findBy({
      role: Role.USER,
      trainer: undefined,
      isActive: true,
      user_membership: { membership: { name: Not('Free') } },
    });
    if (!students.length) throw new NotFoundException('Students not found');
    return students;
  }

  async getTrainerStudents(id: string) {
    const trainer = await this.usersRepository.findOneBy({ id });
    if (!trainer) throw new NotFoundException('Trainer not found');
    const students = await this.usersRepository.findBy({ trainer });
    if (!students.length) throw new NotFoundException('Students not found');
    return students;
  }

  async assignStudents(id: string, userId: string) {
    const trainer = await this.usersRepository.findOneBy({ id });
    if (!trainer) throw new NotFoundException('Trainer not found');
    const student = await this.usersRepository.findOneBy({ id: userId });
    if (!student) throw new NotFoundException('Student not found');
    await this.usersRepository.update(student.id, { trainer });
    return { message: 'Student successfully assigned' };
  }
}
