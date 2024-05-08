import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(
    password: string,
    args?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (password !== (args.object as any)[args.constraints[0]]) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const property = args.property;
    const constraintName = args.constraints[0];
    return `${property} does not match ${constraintName}`;
  }
}
