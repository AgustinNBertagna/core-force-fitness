import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './users.repository';
import { Roles } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Roles])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
