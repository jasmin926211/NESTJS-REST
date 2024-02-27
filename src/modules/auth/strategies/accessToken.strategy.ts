import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../types/accessTokenPayload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: AccessTokenPayload) {
    try {
      const now = Date.now() / 1000;
      if (payload.exp && now > payload.exp)
        throw new UnauthorizedException('Token has expired');

      return payload;
    } catch (error) {
      // Handle validation errors
      throw new UnauthorizedException('Invalid token');
    }
  }
}
