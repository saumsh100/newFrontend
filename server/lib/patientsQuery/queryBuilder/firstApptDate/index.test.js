
import queryFirstAppointment from './';

describe('first appointment query builder', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1, 0, 0, 0));
  });
  test('between', () => {
    expect(queryFirstAppointment([
      new Date(2017, 1, 1).toISOString(),
      new Date(2019, 1, 1).toISOString(),
    ])).toEqual({
      where: {
        firstApptDate: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
      },
    });
  });

  test('before relative', () => {
    expect(queryFirstAppointment({
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 5, 15).toISOString(),
      },
    })).toEqual({
      where: {
        firstApptDate: {
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
    expect(queryFirstAppointment({
      afterRelative: {
        interval: '8 days',
        date: new Date(2018, 5, 12).toISOString(),
      },
    })).toEqual({
      where: {
        firstApptDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 12).toISOString(),
              new Date(2018, 5, 20).toISOString(),
            ],
          }],
        },
      },
    });
  });

  test('after and before relative', () => {
    expect(queryFirstAppointment({
      afterRelative: {
        interval: '9 day',
        date: new Date(2018, 5, 15).toISOString(),
      },
      beforeRelative: {
        interval: '11 day',
        date: new Date(2018, 6, 15).toISOString(),
      },
    })).toEqual({
      where: {
        firstApptDate: {
          $and: [
            {
              $between: [
                new Date(2018, 5, 15).toISOString(),
                new Date(2018, 5, 24).toISOString(),
              ],
            },
            {
              $between: [
                new Date(2018, 6, 4).toISOString(),
                new Date(2018, 6, 15).toISOString(),
              ],
            },
          ],
        },
      },
    });
  });

  test('raw', () => {
    expect(queryFirstAppointment({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        firstApptDate: {
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
    expect(queryFirstAppointment({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '17 day',
        date: new Date(2018, 6, 15).toISOString(),
      },
    }))
      .toEqual({
        where: {
          firstApptDate: {
            $and: [
              { $lt: new Date(2018, 11, 20).toISOString() },
              {
                $between: [
                  new Date(2018, 5, 28).toISOString(),
                  new Date(2018, 6, 15).toISOString(),
                ],
              },
            ],
          },
        },
      });
  });
});
