import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypeRoutine } from 'src/helpers/routines.enum';

export class CreateRoutineDto {
  @IsNotEmpty()
  @IsEnum(TypeRoutine)
  typeRoutine: TypeRoutine;

  @IsNotEmpty()
  @IsString()
  routineName: string;
}
