import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
class MatchPasswordValidator implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const object = args.object as any;

    const password = object.password;

    return confirmPassword === password;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Confirm password must match password';
  }
}

export function MatchPassword(): PropertyDecorator {
  return Validate(MatchPasswordValidator);
}
