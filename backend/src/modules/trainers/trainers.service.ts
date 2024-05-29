import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Routine } from 'src/entities/routines.entity';
import { User } from 'src/entities/user.entity';
import { UsersRoutines } from 'src/entities/userRoutine.entity';
import { Role } from 'src/helpers/roles.enum';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Routine) private routineRepository: Repository<Routine>,
    @InjectRepository(UsersRoutines)
    private usersRoutinesRepository: Repository<UsersRoutines>,
  ) {}

  async getTrainers() {
    const trainers = await this.usersRepository.findBy({ role: Role.TRAINER });
    if (!trainers.length) throw new NotFoundException('Trainers not found');
    return trainers;
  }

  async getStudents() {
    const students = await this.usersRepository.findBy({
      role: Role.USER,
      trainer: IsNull(),
      isActive: true,
      user_membership: { membership: { name: Not('Free') } },
    });
    if (!students.length) throw new NotFoundException('Students not found');
    console.log(students);

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

  async deleteRoutine(id: string): Promise<string> {
    const routine: Routine | null = await this.routineRepository.findOne({
      where: { id },
      relations: ['users_routines'],
    });

    if (!routine) throw new NotFoundException('Routine not found');

    try {
      if (routine.users_routines && routine.users_routines.length > 0) {
        for (const userRoutine of routine.users_routines) {
          await this.usersRoutinesRepository.delete(userRoutine.id);
        }
      }

      await this.routineRepository.delete(routine.id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot delete relations from entity',
      );
    }

    return routine.id;
  }

  async assignRoutine(routineId: string, userId: string) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
    });
    if (!routine) throw new NotFoundException('Routine not found');

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['user_routines'],
    });
    if (!user) throw new NotFoundException('User not found');

    const userRoutine = new UsersRoutines();
    userRoutine.routine = routine;
    userRoutine.user = user;

    await this.usersRoutinesRepository.save(userRoutine);

    return { message: 'Routine successfully assigned' };
  }
}
