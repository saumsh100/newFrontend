
import produceTimeOffs from '../../../../server/lib/schedule/produceTimeOffs';

const timeOffs = [
  {
    startDate: '2016-08-01T07:00:00.000Z',
    endDate: '2018-02-03T08:00:00.000Z',
    startTime: '1970-01-31T10:00:00.000Z',
    endTime: '1970-02-01T02:00:00.000Z',
    interval: 1,
    allDay: true,
    fromPMS: false,
    pmsId: null,
    dayOfWeek: 'Monday',
  },
  {
    startDate: '2017-10-23T22:00:00.000Z',
    endDate: '2017-11-12T01:00:00.000Z',
    startTime: null,
    endTime: null,
    interval: null,
    allDay: false,
    fromPMS: false,
    pmsId: null,
    dayOfWeek: null,
  }
];

describe('Schedule Library', () => {
  describe('#produceTimeOffs', () => {
    test('convert all timeoffs (including recurring time offs) to regular time offs', () => {
      const result = produceTimeOffs(
        timeOffs,
        new Date(2017, 10, 1).toISOString(),
        new Date(2017, 10, 8).toISOString()
      );

      expect(result).toMatchSnapshot();
    });
  });
});
