/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

import { NormalResponse } from '../../share';

type TemplateParameter = any[];

@Injectable()
export class UtilService {
  public template<T>(templateData: TemplateStringsArray, param: T[], delimiter: string = '\n'): string {
    let output = '';
    for (let i = 0; i < param.length; i += 1) {
      output += templateData[i] + param[i];
    }
    output += templateData[param.length];
    const lines: string[] = output.split(/(?:\r\n|\n|\r)/);
    return lines
      .map((text: string) => text.replace(/^\s+/gm, ''))
      .join(delimiter)
      .trim();
  }

  public pre(templateData: TemplateStringsArray, ...param: TemplateParameter): string {
    return this.template(templateData, param, '\n');
  }

  public line(templateData: TemplateStringsArray, ...param: TemplateParameter): string {
    return this.template(templateData, param, ' ');
  }

  public isKeyOfSchema<T>(key: unknown, schema: T): key is keyof T {
    return typeof key === 'string' && key in schema;
  }

  public removeUndefined<T>(argv: T): Record<string, unknown> {
    // https://stackoverflow.com/questions/25421233
    return Object.fromEntries(Object.entries(argv).filter(([, value]: [string, unknown]) => value !== undefined));
  }

  public async hash(text: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      const hashed: string = await bcrypt.hash(text, saltOrRounds);
      return hashed;
    } catch (e) {
      return '';
    }
  }

  public async comparePassword(password: string, oldPassword?: string): Promise<boolean> {
    try {
      if (password && oldPassword) {
        const passwordEqual: boolean = await bcrypt.compare(password, oldPassword);
        return passwordEqual;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public buildSuccessResponse(data: any): NormalResponse {
    return {
      code: 0,
      message: '',
      data,
      status: 'success',
    };
  }

  public buildCustomResponse(code: number, data: any, message: string): NormalResponse {
    return {
      code,
      message,
      data,
      status: code === 0 ? 'success' : 'fail',
    };
  }

  public gererateRandomCode(): string {
    return uuid().substring(0, 6);
  }

  public randomNumber(): number {
    const max = 999999;
    const min = 100000;
    return Math.floor(Math.random() * (max - min) + min);
  }
}
