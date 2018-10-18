
import fieldsValidator from './index';
import StatusError from '../../../../server/util/StatusError';


describe('fields validator check', () => {
  const obj = { a: { b: { c: 3 } } };

  test('Should throw an error when object in undefined', () => {
    expect(() => { fieldsValidator(undefined, ['a']); }).toThrow(Error);
  });

  test('Should do nothing when no fields are passed in', () => {
    fieldsValidator(obj, []);
  });

  test('Should do nothing when are fields are valid', () => {
    fieldsValidator(obj, ['a.b.c']);
  });

  test('Should throw StatusError when any field is invalid', () => {
    expect(() => { fieldsValidator(obj, ['a.b.c.d.e']); }).toThrow(StatusError(400, 'a.b.c.d.e is not set'));
  });

  test('Should throw the first invalid field when multiple fields are invalid', () => {
    expect(() => { fieldsValidator(obj, ['a.b.c', 'b.c.d', 'a.s.c']); }).toThrow(StatusError(400, 'b.c.d is not set'));
  });
});
