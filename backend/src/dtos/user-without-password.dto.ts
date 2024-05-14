import { Roles } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';

//va sin class validator

export class userWithoutPasswordDto {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  gender: string;
  address: string;
  trainer: User;
  phoneNumber: string;
  birthdate: string;
  height: string;
  weight: string;
  role: Roles;
  students: User[];
  signup_date: string;
  isActive: boolean;
}

// address: string;
// birthdate: Date;
// email: string;
// gender: string;
// height: number;
// id: string;
// name: string;
// phoneNumber: string;
// profile_image: string;
// role: string;
// signup_date: Date;
// students: any; // Tipo para estudiantes
// trainer: any; // Tipo para entrenador
// user_membership: any; // Tipo para membresía de usuario
// weight: number;
