
import coalesce from './index';

describe('#coalesce', () => {
  test('should be a function', () => {
    expect(typeof coalesce).toBe('function');
  });

  test('should work with null', () => {
    expect(coalesce(null, 'test')).toBe('test');
  });

  test('should work with undefined', () => {
    expect(coalesce(undefined, 'test')).toBe('test');
  });

  test('should work with NaN', () => {
    expect(coalesce(NaN, 'test')).toBe('test');
    expect(coalesce(parseInt('Not a number', 10), 'test')).toBe('test');
  });

  test('should work with multiple arguments', () => {
    expect(coalesce(null, 'test', undefined, 'test2')).toBe('test');
  });

  test('should work with multiple types', () => {
    const dummyFunc = () => {};
    expect(coalesce(null, -1, undefined, 2)).toBe(-1);
    expect(coalesce(null, 0, undefined, 2)).toBe(0);
    expect(coalesce(null, 1, undefined, 2)).toBe(1);
    expect(coalesce(null, { test: 'test' }, undefined, 'test2')).toEqual({ test: 'test' });
    expect(coalesce(null, ['test'], undefined, 'test2')).toEqual(['test']);
    expect(coalesce(null, dummyFunc, undefined, 'test2')).toBe(dummyFunc);
  });

  test('should work with empties', () => {
    expect(coalesce(null, {}, undefined, 'test2')).toEqual({});
    expect(coalesce(null, [], undefined, 'test2')).toEqual([]);
  });
});
