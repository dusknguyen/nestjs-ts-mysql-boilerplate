import BigNumber from 'bignumber.js';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function isPositiveBigNumber(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveBigNumber',
      target: object.constructor,
      propertyName,
      options: {
        ...validationOptions,
        message: 'BigNumber string greater than 0',
      },
      validator: {
        validate(value: string) {
          return typeof value === 'string' && new BigNumber(value).gt(0);
        },
      },
    });
  };
}
