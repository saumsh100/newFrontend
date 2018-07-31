
import normalizePhone from './index';

describe('sanitize the phone number', () => {
  test('when more text is passed on the same string that the actual phone number, including a wrong country code with space', () => {
    expect(normalizePhone('my telephone is + 9 (country code) number: 236 111 2222')).toEqual('+1 236 111 2222');
  });
  test('when more text is passed on the same string that the actual phone number', () => {
    expect(normalizePhone('actually my new phone 236 111 2222')).toEqual('+1 236 111 2222');
  });
  test('to +1 when the user is passing a different phone code than +1', () => {
    expect(normalizePhone('+2')).toEqual('+1');
  });
  test('to the passed number without special characters', () => {
    expect(normalizePhone('+1 (236)')).toEqual('+1 236');
  });
  test('when the plus sign is used in any position other than as the first character', () => {
    expect(normalizePhone('+2236 +1112 +222')).toEqual('+1 236 111 2222');
  });
});

describe('normalize phone numbers', () => {
  test('to the number prepended with +1 and space when the given number does not start with the area code', () => {
    expect(normalizePhone('2361')).toEqual('+1 236 1');
  });
  test('to the number prepended with +1 and space when the given number does not start with the area code', () => {
    expect(normalizePhone('+1236111')).toEqual('+1 236 111');
  });
  test('to the number prepended with +1 and space when the given number does not start with the area code', () => {
    expect(normalizePhone('+1236111 2222')).toEqual('+1 236 111 2222');
  });
  test('to the number prepended with +1 and space when the given number does not start with the area code', () => {
    expect(normalizePhone('+1 2361')).toEqual('+1 236 1');
  });
  test('to the number prepended with +1 and space when the given number does not start with the area code', () => {
    expect(normalizePhone('236 ')).toEqual('+1 236 ');
  });
  test('to the current number with spaces and the area code when passing a 10 digits phone number', () => {
    expect(normalizePhone('2361112222')).toEqual('+1 236 111 2222');
  });
  test('to the current number with spaces when passing a 10 digits phone number + area code', () => {
    expect(normalizePhone('+12361112222')).toEqual('+1 236 111 2222');
  });
  test('to the same number when the format is already valid', () => {
    expect(normalizePhone('+1 236 111 2222')).toEqual('+1 236 111 2222');
  });
});
