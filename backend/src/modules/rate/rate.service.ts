import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../users/users.repository';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from 'src/entities/rate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RateService {
  constructor(
    private readonly usersRepository: UserRepository,
    @InjectRepository(Rate)
    private rateRepository: Repository<Rate>,
  ) {}
  async addRate(rate: number, description: string, userId: string) {
    const user: User | null = await this.usersRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const newRate = new Rate();
    newRate.description = description;
    newRate.rating = rate;
    newRate.user = user;

    await this.rateRepository.save(newRate);
  }
}
