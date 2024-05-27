import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  iduser: string;

  @Column()
  idTrainer: string;

  @Column()
  room: string; // id user

  @Column('jsonb')
  messages: { user: string; body: string }[];

  @CreateDateColumn()
  createdAt: Date;
}
