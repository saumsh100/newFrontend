
import setDateAndTZ from './';

const timezone = 'America/Vancouver';
const time = '1970-02-01T01:00:00.000Z';
const date = {
  years: 2018,
  months: 11,
  date: 6,
};

describe('setDateAndTimeZone', () => {
  it('set date and timezone to a given time', () => {
    const result = setDateAndTZ(time, date, timezone);
    expect(result.toISOString()).toEqual('2018-12-07T01:00:00.000Z');
  });

  it('set hour and timezone to a given time', () => {
    const result = setDateAndTZ(time, { hours: 3 }, timezone);
    expect(result.toISOString()).toEqual('1970-01-31T11:00:00.000Z');
  });
});
