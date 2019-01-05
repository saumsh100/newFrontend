
import queryPmsCreatedAt from './';

describe('pmsCreatedAt query builder', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1, 0, 0, 0));
  });

  it('between', () => {
    expect(queryPmsCreatedAt([
      new Date(2017, 1, 1).toISOString(),
      new Date(2019, 1, 1).toISOString(),
    ])).toEqual({
      where: {
        pmsCreatedAt: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
      },
    });
  });

  it('before relative', () => {
    expect(queryPmsCreatedAt({
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 5, 15).toISOString(),
      },
    })).toEqual({
      where: {
        pmsCreatedAt: {
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

  it('after relative', () => {
    expect(queryPmsCreatedAt({
      afterRelative: {
        interval: '5 days',
        date: new Date(2018, 5, 15).toISOString(),
      },
    })).toEqual({
      where: {
        pmsCreatedAt: {
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


  it('after and before relative', () => {
    expect(queryPmsCreatedAt({
      afterRelative: {
        interval: '7 days',
        date: new Date(2018, 5, 15).toISOString(),
      },
      beforeRelative: {
        interval: '3 day',
        date: new Date(2018, 6, 15).toISOString(),
      },
    })).toEqual({
      where: {
        pmsCreatedAt: {
          $and: [
            {
              $between: [
                new Date(2018, 5, 15).toISOString(),
                new Date(2018, 5, 22).toISOString(),
              ],
            },
            {
              $between: [
                new Date(2018, 6, 12).toISOString(),
                new Date(2018, 6, 15).toISOString(),
              ],
            },
          ],
        },
      },
    });
  });

  it('raw', () => {
    expect(queryPmsCreatedAt({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        pmsCreatedAt: {
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
    expect(queryPmsCreatedAt({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '14 days',
        date: new Date(2018, 6, 15).toISOString(),
      },
    }))
      .toEqual({
        where: {
          pmsCreatedAt: {
            $and: [
              { $lt: new Date(2018, 11, 20).toISOString() },
              {
                $between: [
                  new Date(2018, 6, 1).toISOString(),
                  new Date(2018, 6, 15).toISOString(),
                ],
              },
            ],
          },
        },
      });
  });
});
