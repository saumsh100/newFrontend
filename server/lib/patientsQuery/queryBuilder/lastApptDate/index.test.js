
import queryLastAppointment from './';

describe('last appointment query builder', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1, 0, 0, 0));
  });

  test('between array', () => {
    expect(queryLastAppointment([
      new Date(2017, 1, 1).toISOString(),
      new Date(2019, 1, 1).toISOString(),
    ])).toEqual({
      where: {
        lastApptDate: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
      },
    });
  });

  test('before relative', () => {
    expect(queryLastAppointment({
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 5, 15).toISOString(),
      },
    })).toEqual({
      where: {
        lastApptDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 5).toISOString(),
              new Date(2018, 5, 15).toISOString(),
            ],
          }],
        },
      },
    });
  });

  test('after relative', () => {
    expect(queryLastAppointment({
      afterRelative: {
        interval: '5 days',
        date: new Date(2018, 5, 15).toISOString(),
      },
    })).toEqual({
      where: {
        lastApptDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 15).toISOString(),
              new Date(2018, 5, 20).toISOString(),
            ],
          }],
        },
      },
    });
  });

  test('after and before relative', () => {
    expect(queryLastAppointment({
      afterRelative: {
        interval: '10 day',
        date: new Date(2018, 5, 15).toISOString(),
      },
      beforeRelative: {
        interval: '5 days',
        date: new Date(2018, 6, 15).toISOString(),
      },
    })).toEqual({
      where: {
        lastApptDate: {
          $and: [
            {
              $between: [
                new Date(2018, 5, 15).toISOString(),
                new Date(2018, 5, 25).toISOString(),
              ],
            },
            {
              $between: [
                new Date(2018, 6, 10).toISOString(),
                new Date(2018, 6, 15).toISOString(),
              ],
            },
          ],
        },
      },
    });
  });

  test('raw', () => {
    expect(queryLastAppointment({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        lastApptDate: {
          $and: [{
            $between: [
              new Date(2018, 11, 10).toISOString(),
              new Date(2018, 11, 20).toISOString(),
            ],
          },
          ],
        },
      },
    });
  });

  test('raw and before relative', () => {
    expect(queryLastAppointment({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 6, 15).toISOString(),
      },
    }))
      .toEqual({
        where: {
          lastApptDate: {
            $and: [
              { $lt: new Date(2018, 11, 20).toISOString() },
              {
                $between: [
                  new Date(2018, 6, 5).toISOString(),
                  new Date(2018, 6, 15).toISOString(),
                ],
              },
            ],
          },
        },
      });
  });
});
