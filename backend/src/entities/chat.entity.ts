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

  @Column({ type: 'text', nullable: true })
  userId: string;

  @Column({ type: 'text', nullable: true })
  idTrainer: string;

  @Column()
  room: string; // id user

  @Column('jsonb')
  messages: { user: string; body: string }[];

  @CreateDateColumn()
  createdAt: Date;
}
