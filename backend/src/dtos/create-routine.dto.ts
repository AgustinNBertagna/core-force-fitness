import { IsEnum, IsString } from 'class-validator';
import { TypeRoutine } from 'src/helpers/routines.enum';

export class CreateRoutineDto {
  @IsEnum(TypeRoutine)
  typeRoutine: TypeRoutine;

  @IsString()
  routineName: string;
}
