
import createAvailabilitiesFromOpening from '../../../../server/lib/availabilities/createAvailabilitiesFromOpening';

const iso = time => `2018-03-08T${time}:00.000Z`;
const d = time => new Date(iso(time));

describe('#createAvailabilitiesFromOpening', () => {
  test('it should be a function', () => {
    expect(typeof createAvailabilitiesFromOpening).toBe('function');
  });

  test('should return 0 availabilities cause duration is too long', () => {
    expect(createAvailabilitiesFromOpening({
      startDate: d('08:00'),
      endDate: d('08:30'),
      duration: 60,
      interval: 30,
    })).toEqual([]);
  });

  test('should return 1 availability', () => {
    expect(createAvailabilitiesFromOpening({
      startDate: d('07:59'),
      endDate: d('08:30'),
      duration: 30,
      interval: 30,
    })).toEqual([
      {
        startDate: iso('08:00'),
        endDate: iso('08:30'),
      },
    ]);
  });

  test('should return 1 availability', () => {
    expect(createAvailabilitiesFromOpening({
      startDate: d('08:00'),
      endDate: d('08:30'),
      duration: 30,
      interval: 30,
    })).toEqual([
      {
        startDate: iso('08:00'),
        endDate: iso('08:30'),
      },
    ]);
  });

  test('should return 3 availabilities', () => {
    expect(createAvailabilitiesFromOpening({
      startDate: d('08:01'),
      endDate: d('09:01'),
      duration: 15,
      interval: 15,
    })).toEqual([
      {
        startDate: iso('08:15'),
        endDate: iso('08:30'),
      },
      {
        startDate: iso('08:30'),
        endDate: iso('08:45'),
      },
      {
        startDate: iso('08:45'),
        endDate: iso('09:00'),
      },
    ]);
  });

  test('should return 1 availability', () => {
    expect(createAvailabilitiesFromOpening({
      startDate: d('11:30'),
      endDate: d('13:30'),
      duration: 120,
      interval: 30,
    })).toEqual([
      {
        startDate: iso('11:30'),
        endDate: iso('13:30'),
      },
    ]);
  });
});
