
import timeOptionsWithTimezone, { cachedTimezone, cachedResultsList } from './';

const timezone = 'America/Vancouver';

let results = null;

describe('timeOptionsWithTimezone', () => {
  it('generate options by including timezone', () => {
    results = timeOptionsWithTimezone(timezone);
    expect(results).toMatchSnapshot();
    expect(cachedTimezone).toEqual(timezone);
    expect(cachedResultsList).toEqual(results);
  });

  it('returns cached result', () => {
    const values = timeOptionsWithTimezone(timezone);
    expect(values).toEqual(results);
  });

  it('overwrites cached values when different timezone is provided', () => {
    const nyTimezone = 'America/New_York';
    const values = timeOptionsWithTimezone(nyTimezone);
    expect(values).not.toEqual(results);
    expect(cachedTimezone).toEqual(nyTimezone);
    expect(values).toEqual(cachedResultsList);
  });

  it('throws if timezone is not a string', () => {
    expect(() => {
      timeOptionsWithTimezone(123);
    }).toThrowError('Timezone has to be string');
  });
});
