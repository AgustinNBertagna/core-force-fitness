import { Module } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Routine } from 'src/entities/routines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Routine])],
  controllers: [TrainersController],
  providers: [TrainersService],
})
export class TrainersModule {}
