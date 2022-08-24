import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../../../../entity';
import { ConfigService } from '../../providers';
import { JwtPayload, JwtSign, Payload } from '../auth.payload';

@Injectable()
export class AuthenticationService {
  constructor(private jwt: JwtService, private config: ConfigService, @InjectRepository(User) private userRepository: Repository<User>) {}

  public async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ name: username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  public validateRefreshToken(data: Payload, refreshToken: string): boolean {
    if (!this.jwt.verify(refreshToken, { secret: this.config.get('jwtSecret') })) {
      return false;
    }
    const payload = <{ sub: string }>this.jwt.decode(refreshToken);
    return payload.sub === data.userId;
  }

  public jwtSign(data: Payload): JwtSign {
    const payload: JwtPayload = {
      sub: data.userId,
      username: data.username,
      roles: data.roles,
    };
    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub),
    };
  }

  private getRefreshToken(sub: string): string {
    return this.jwt.sign(
      { sub },
      {
        secret: this.config.get('jwtSecret'),
        expiresIn: '7d', // Set greater than the expiresIn of the access_token
      },
    );
  }
}
