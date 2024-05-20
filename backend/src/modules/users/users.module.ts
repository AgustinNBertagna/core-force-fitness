import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './users.repository';
import { Membership } from 'src/entities/membership.entity';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { Rate } from 'src/entities/rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Membership, UserMemberships, Rate]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
