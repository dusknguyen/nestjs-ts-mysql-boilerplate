import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { Payload } from '../auth.payload';
import { AuthenticationService } from '../providers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthenticationService) {
    super();
  }

  public async validate(username: string, password: string): Promise<Payload> {
    const user = await this.auth.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('NotFoundUser');
    }
    const roleslist = user.roles;
    return {
      userId: user.id,
      username: user.name,
      roles: roleslist,
    };
  }
}
