// import { User } from 'src/entities/user.entity';
// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// @Entity({
//   name: 'trainers',
// })
// export class Trainer {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', length: 50, nullable: false })
//   name: string;

//   @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
//   email: string;

//   @Column({ type: 'varchar', nullable: false })
//   password: string;

//   @Column({ type: 'varchar', nullable: true })
//   profile_image: string;

//   @Column({ type: 'varchar', nullable: false })
//   phonenumber: number;

//   @Column({ type: 'boolean', default: 'false' })
//   isAdmin: boolean;

//   @OneToMany(() => User, (user) => user.trainer)
//   users: User[];
// }
