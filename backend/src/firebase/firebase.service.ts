import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly firebaseAuth: admin.auth.Auth;

  constructor() {
    const firebaseApp = admin.initializeApp();
    this.firebaseAuth = firebaseApp.auth();
  }

  async signInWithGoogle(idToken: string): Promise<string> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { uid } = decodedToken; // no se usa ya que el decodedtoken se checkea en la web de firebase
      return 'Inicio de sesión exitoso con Google.';
    } catch (error) {
      throw new UnauthorizedException('Error al iniciar sesión con Google.');
    }
  }
}
