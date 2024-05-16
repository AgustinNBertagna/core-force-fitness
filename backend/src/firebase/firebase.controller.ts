import { Controller, Get, Post, Body } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from 'src/dtos/create-firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('signup')
  async createUserFirebase(@Body() userFirebase: CreateFirebaseDto) {
    await this.firebaseService.createUserFirebase(userFirebase);
  }

  @Post('signin')
  async loginUserFirebase(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<string> {
    return await this.firebaseService.loginUserFirebase(email, password);
  }

  // @Post('google')
  // async signInWithGoogle(@Body('idToken') idToken: string) {
  //   return this.firebaseService.signInWithGoogle(idToken);
  // }

  @Get('getData')
  async getData(): Promise<any> {
    return await this.firebaseService.getData();
  }
}
