import { PartialType } from '@nestjs/mapped-types';
import { CreateFirebaseDto } from './create-firebase.dto';

export class UpdateFirebaseDto extends PartialType(CreateFirebaseDto) {}
