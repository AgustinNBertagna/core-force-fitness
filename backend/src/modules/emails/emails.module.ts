import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
