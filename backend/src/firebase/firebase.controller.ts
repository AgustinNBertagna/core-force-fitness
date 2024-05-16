import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('google')
  async signInWithGoogle(@Body('idToken') idToken: string) {
    try {
      const message = await this.firebaseService.signInWithGoogle(idToken);
      return { message };
    } catch (error) {
      throw new BadRequestException('No se pudo registrar con google');
    }
  }
}
