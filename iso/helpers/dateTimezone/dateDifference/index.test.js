
import dateDiffInMinutes from './index';

describe('date difference test', () => {
  const startTime = new Date(1970, 1, 1, 7);
  const endTime = new Date(1970, 1, 1, 17);

  test('Should return positive value when endTime is after startTime', () => {
    expect(dateDiffInMinutes(startTime, endTime)).toBe(600);
  });

  test('Should return negative value when endTime is before startTime', () => {
    expect(dateDiffInMinutes(endTime, startTime)).toBe(-600);
  });

  test('Should return 0 when endTime is the same as startTime', () => {
    expect(dateDiffInMinutes(startTime, startTime)).toBe(0);
  });

  test('Should throw an error when endTime or startTime is not Date', () => {
    expect(() => { dateDiffInMinutes(undefined, endTime); }).toThrow(Error);
    expect(() => { dateDiffInMinutes(null, endTime); }).toThrow(Error);
    expect(() => { dateDiffInMinutes(startTime, 'a'); }).toThrow(Error);
    expect(() => { dateDiffInMinutes(startTime, []); }).toThrow(Error);
    expect(() => { dateDiffInMinutes(startTime, {}); }).toThrow(Error);
  });
});

