
import cap from './index';

describe('sanitize the phone number', () => {
  test('It is a function', () => {
    expect(typeof cap).toEqual('function');
  });
  test('Capitalize the first letter of a word', () => {
    expect(cap('reminder')).toEqual('Reminder');
  });
  test('Capitalize every first letter of a sentence', () => {
    expect(cap('1 hour reminder')).toEqual('1 Hour Reminder');
  });
  test('Works without trimming', () => {
    expect(cap(' 1 hour reminder ')).toEqual(' 1 Hour Reminder ');
  });
});
