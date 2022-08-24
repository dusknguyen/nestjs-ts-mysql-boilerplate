import { HttpException } from '@nestjs/common';

export const ACCOUNT_NOT_FOUND = new HttpException('Account not found.', 1);
