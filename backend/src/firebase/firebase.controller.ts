import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from 'src/dtos/create-firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('google')
  async createUserWithGoogle(@Body() createUserDto: CreateFirebaseDto) {
    await this.firebaseService.createUserWithGoogle(createUserDto);
  }
}
