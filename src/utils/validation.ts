import { registerDecorator } from 'class-validator';

import validatePassword from './validate-password';

export function IsValidPassword() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: string) {
          const { isValid, messages } = validatePassword(value);

          this.customMessages = messages;

          return isValid;
        },
        defaultMessage() {
          return this.customMessages.join(', ') || 'Password is weak';
        },
      },
    });
  };
}
