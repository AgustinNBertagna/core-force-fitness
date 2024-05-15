import { Injectable, UnauthorizedException } from '@nestjs/common';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { DataSnapshot, get, push, ref, set } from 'firebase/database';
import { firebaseAuth, firebaseDatabase } from 'src/config/firebase.config';
import { CreateFirebaseDto } from 'src/dtos/create-firebase.dto';

@Injectable()
export class FirebaseService {
  async createUserFirebase(userFirebase: CreateFirebaseDto): Promise<string> {
    const dataRef = ref(firebaseDatabase, 'Data');
    const newElementRef = push(dataRef, { dataRef: userFirebase });
    await set(newElementRef, userFirebase);
    return 'Usuario creado correctamente';
  }

  async loginUserFirebase(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      return `Usuario ${userCredential.user.email} ha iniciado sesión correctamente.`;
    } catch (error) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
  }

  async getData(): Promise<any> {
    const dataRef = ref(firebaseDatabase, 'Data');
    const snapshot: DataSnapshot = await get(dataRef);
    console.log('data recibida exitosamente');
    return snapshot.val();
  }
}
