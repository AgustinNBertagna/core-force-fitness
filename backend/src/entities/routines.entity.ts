import { TypeRoutine } from 'src/helpers/routines.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'routines',
})
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'enum', enum: TypeRoutine, nullable: false })
  type: TypeRoutine;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  pdf_url: string;
}
