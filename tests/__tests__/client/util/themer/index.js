
import { StyleExtender } from '../../../../../client/components/Utils/Themer';
import isEqual from 'lodash/isEqual';

const baseStyles = {
  input: 'a',
  label: 'b',
  bar: 'c',
};

const extendStyles = {
  label: 'a',
};

const emptyTheme = {};

describe('StyleExtender', () => {
  test('A base label element extended with a new theme style', () => {
    const baseStylesLabel = baseStyles.label;
    const extendStylesLabel = extendStyles.label;
    const newStyle = StyleExtender(extendStyles, baseStyles);
    expect(newStyle.label).toBe(`${extendStylesLabel} ${baseStylesLabel}`);
    expect(Object.keys(newStyle).length).toBe(3);
  });

  test('Testing style extension with empty theme', () => {
    const newStyle = StyleExtender(emptyTheme, baseStyles);
    expect(isEqual(newStyle, baseStyles)).toBe(true);
  });

  test('Should keep all keys and not only take one objects keys', () => {
    const a = { cat: '1' };
    const b = { dog: '2' };
    expect(StyleExtender(a, b)).toMatchObject({ cat: '1', dog: '2' });
  });
});
