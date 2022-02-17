export const SPECIAL_CHARACTERS = ['#', '?', '!', '@', '$', '%', '^', '&', '*'];

export enum VALIDATION_PASSWORD_MESSAGE {
  AtLeastOneNumber,
  MinLength,
  MaxLength,
  AtLeastOneLowerCaseLatinLetter,
  AtLeastOneUpperCaseLatinLetter,
  AtLeastOneSpecialCharacter,
  BlankSpaceInTheBeginning,
  BlankSpaceInTheEnd,
  OnlySupportedSymbols,
}

export const messagesMap: Record<VALIDATION_PASSWORD_MESSAGE, string> = {
  [VALIDATION_PASSWORD_MESSAGE.AtLeastOneNumber]:
    'Please add at least one number',
  [VALIDATION_PASSWORD_MESSAGE.MinLength]:
    'Please make your password at least 8 characters long',
  [VALIDATION_PASSWORD_MESSAGE.MaxLength]:
    'Please make your password less than 128 characters',
  [VALIDATION_PASSWORD_MESSAGE.AtLeastOneLowerCaseLatinLetter]:
    'Please add at least one lower case latin letter',
  [VALIDATION_PASSWORD_MESSAGE.AtLeastOneUpperCaseLatinLetter]:
    'Please add at least one upper case latin letter',
  [VALIDATION_PASSWORD_MESSAGE.AtLeastOneSpecialCharacter]: `Please add at least one special characters from the list ${SPECIAL_CHARACTERS.join(
    ', ',
  )}`,
  [VALIDATION_PASSWORD_MESSAGE.BlankSpaceInTheBeginning]:
    'Password cannot start or end with a blank space',
  [VALIDATION_PASSWORD_MESSAGE.BlankSpaceInTheEnd]:
    'Password cannot start or end with a blank space',
  [VALIDATION_PASSWORD_MESSAGE.OnlySupportedSymbols]: `Password cannot contain non-latin letters and special characters that are not in the list ${SPECIAL_CHARACTERS.join(
    ', ',
  )}`,
};

export interface IValidateResult {
  isValid: boolean;
  messages: string[];
}

export default function validatePassword(value: string) {
  const result: IValidateResult = {
    isValid: true,
    messages: [],
  };

  const hasMinAllowedLength = value.length > 7;
  if (!hasMinAllowedLength) {
    result.isValid = false;
    result.messages.push(messagesMap[VALIDATION_PASSWORD_MESSAGE.MinLength]);
  }

  const hasMaxAllowedLength = value.length > 128;
  if (hasMaxAllowedLength) {
    result.isValid = false;
    result.messages.push(messagesMap[VALIDATION_PASSWORD_MESSAGE.MaxLength]);
  }

  const hasUnSupportedSymbols = new RegExp(
    `[^A-Za-z0-9${SPECIAL_CHARACTERS.join()}]`,
  ).test(value);
  if (hasUnSupportedSymbols) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.OnlySupportedSymbols],
    );
  }

  const hasAtLeastOneDigit = /\d/.test(value);
  if (!hasAtLeastOneDigit) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneNumber],
    );
  }

  const hasAtLeastOneUpperCaseLatinLetter = /[A-Z]/.test(value);
  if (!hasAtLeastOneUpperCaseLatinLetter) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneUpperCaseLatinLetter],
    );
  }

  const hasAtLeastOneLowerCaseLatinLetter = /[a-z]/.test(value);
  if (!hasAtLeastOneLowerCaseLatinLetter) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneLowerCaseLatinLetter],
    );
  }

  const hasAtLeastOneSpecialCharacter = new RegExp(
    `[${SPECIAL_CHARACTERS.join()}]`,
  ).test(value);
  if (!hasAtLeastOneSpecialCharacter) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneSpecialCharacter],
    );
  }

  const hasSpaceInTheBeginning = /^ /.test(value);
  if (hasSpaceInTheBeginning) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.BlankSpaceInTheBeginning],
    );
  }

  const hasSpaceInTheEnd = / $/.test(value);
  if (hasSpaceInTheEnd) {
    result.isValid = false;
    result.messages.push(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.BlankSpaceInTheEnd],
    );
  }

  return result;
}
