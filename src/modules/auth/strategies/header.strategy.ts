import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../auth.interface';
import { AUTH_STRATEGY } from 'shared/constants/strategy.constant';
/**
 *
 */
@Injectable()
export class HeaderStrategy extends PassportStrategy(Strategy, AUTH_STRATEGY.API_KEY) {
  /**
   *
   */
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwtSecret'),
    });
  }

  /**
   *
   */
  public validate(payload: Payload): Payload {
    return { userId: payload.userId, timestamp: payload.timestamp };
  }
}
