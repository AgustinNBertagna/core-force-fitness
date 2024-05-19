import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { UsersModule } from '../users/users.module';
import { Rate } from 'src/entities/rate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rate]), UsersModule],
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule {}
