
import queryNextAppointment from './';

describe('next appointment query builder', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1, 0, 0, 0));
  });
  it('between', () => {
    expect(queryNextAppointment([
      new Date(2017, 1, 1).toISOString(),
      new Date(2019, 1, 1).toISOString(),
    ])).toEqual({
      where: {
        nextApptDate: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
      },
    });
  });

  it('before relative', () => {
    expect(queryNextAppointment({
      beforeRelative: {
        interval: '13 days',
        date: new Date(2018, 5, 20).toISOString(),
      },
    })).toEqual({
      where: {
        nextApptDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 7).toISOString(),
              new Date(2018, 5, 20).toISOString(),
            ],
          }],
        },
      },
    });
  });

  it('after relative', () => {
    expect(queryNextAppointment({
      afterRelative: {
        interval: '7 days',
        date: new Date(2018, 5, 13).toISOString(),
      },
    })).toEqual({
      where: {
        nextApptDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 13).toISOString(),
              new Date(2018, 5, 20).toISOString(),
            ],
          }],
        },
      },
    });
  });


  it('after and before relative', () => {
    expect(queryNextAppointment({
      afterRelative: {
        interval: '5 day',
        date: new Date(2018, 5, 15).toISOString(),
      },
      beforeRelative: {
        interval: '5 day',
        date: new Date(2018, 6, 15).toISOString(),
      },
    })).toEqual({
      where: {
        nextApptDate: {
          $and: [
            {
              $between: [
                new Date(2018, 5, 15).toISOString(),
                new Date(2018, 5, 20).toISOString(),
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

  it('raw', () => {
    expect(queryNextAppointment({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        nextApptDate: {
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

  it('raw and before relative', () => {
    expect(queryNextAppointment({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 6, 15).toISOString(),
      },
    }))
      .toEqual({
        where: {
          nextApptDate: {
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
