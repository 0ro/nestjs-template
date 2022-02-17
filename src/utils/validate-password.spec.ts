import validatePassword, {
  messagesMap,
  VALIDATION_PASSWORD_MESSAGE,
} from './validate-password';

describe('validate password', () => {
  it('should pass validation', () => {
    const password = '#Aaaaaa1';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(true);
    expect(messages.length).toBe(0);
  });
  it('should contain at least one number', () => {
    const password = '#aaaaaaa';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneNumber],
    );
  });
  it('should have at least one upper case letter', () => {
    const password = '#aaaaaa1';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneUpperCaseLatinLetter],
    );
  });
  it('should have at least one lower case letter', () => {
    const password = '#AAAAAA1';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneLowerCaseLatinLetter],
    );
  });
  it('should have at least one special character', () => {
    const password = 'Aaaaaaa1';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.AtLeastOneSpecialCharacter],
    );
  });
  it('should have at least 8 length', () => {
    const password = '#Aaaaa1';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.MinLength],
    );
  });
  it('should have less than 128 length', () => {
    const password =
      '#Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.MaxLength],
    );
  });
  it("shouldn't contain forbidden characters", () => {
    const password = 'Aaaaaa1#<';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.OnlySupportedSymbols],
    );
  });
  it("it shouldn't contain blank space in the beginning", () => {
    const password = ' Aaaaaa1#';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.BlankSpaceInTheBeginning],
    );
  });
  it("it shouldn't contain blank space in the end", () => {
    const password = 'Aaaaaa1# ';
    const { isValid, messages } = validatePassword(password);

    expect(isValid).toBe(false);
    expect(messages).toContain(
      messagesMap[VALIDATION_PASSWORD_MESSAGE.BlankSpaceInTheEnd],
    );
  });
});
