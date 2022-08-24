import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { Payload } from '../auth.payload';

@Injectable()
export class AuthenticationSerializer extends PassportSerializer {
  public serializeUser(user: Payload, done: (err: Error | null, data?: Payload) => void): void {
    done(null, user);
  }

  public deserializeUser(data: Payload, done: (err: Error | null, user?: Payload) => void): void {
    try {
      done(null, data);
    } catch (err) {
      done(<Error>err);
    }
  }
}
