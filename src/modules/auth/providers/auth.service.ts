import { Injectable } from '@nestjs/common';
import { ACCOUNT_NOT_FOUND } from 'src/constants';
import { UtilService } from 'src/modules/common';
import { AuthenticationService, Payload } from 'src/modules/common/authentication';
import { NormalResponse } from 'src/modules/share';

import { LoginDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(private util: UtilService, private authenticationService: AuthenticationService) {}

  /**
   * See test/e2e/jwt-authentication.spec.ts
   */
  public async login(loginDto: LoginDto): Promise<NormalResponse> {
    const check = await this.authenticationService.validateUser(loginDto.username, loginDto.password);
    if (!check) {
      throw ACCOUNT_NOT_FOUND;
    }
    // eslint-disable-next-line @typescript-eslint/typedef
    const roleslist = check.roles;
    const user = {
      userId: check.id,
      username: check.name,
      roles: roleslist,
    };
    return this.util.buildSuccessResponse(this.authenticationService.jwtSign(user));
  }

  public jwtCheck(user: Payload): NormalResponse {
    return this.util.buildSuccessResponse(user);
  }
}
