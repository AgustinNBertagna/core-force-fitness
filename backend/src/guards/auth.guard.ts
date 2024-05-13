import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization)
      throw new UnauthorizedException('Missing request authorization header');

    const token = req.headers.authorization.split(' ')[1];

    if (!token) throw new UnauthorizedException('Missing authentication token');

    try {
      const secret = process.env.JWT_SECRET;

      const payload = this.jwtService.verify(token, { secret });

      req.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
