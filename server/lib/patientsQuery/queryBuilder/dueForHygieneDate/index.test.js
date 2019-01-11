
import dueForHygieneQuery from './';

describe('Due For Hygiene Query', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1));
  });

  test('between', () => {
    expect(dueForHygieneQuery([
      '2017-02-01',
      '2019-02-01',
    ])).toEqual({
      where: {
        dueForHygieneDate: {
          $between: [
            new Date(2017, 1, 1, 0, 0, 0).toISOString(),
            new Date(2019, 1, 1, 23, 59, 59, 999).toISOString(),
          ],
        },
      },
    });
  });

  test('before relative', () => {
    expect(dueForHygieneQuery({
      beforeRelative: {
        interval: '10 day',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        dueForHygieneDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 5, 0, 0, 0).toISOString(),
              new Date(2018, 5, 15, 23, 59, 59, 999).toISOString(),
            ],
          }],
        },
      },
    });
  });

  it('after relative', () => {
    expect(dueForHygieneQuery({
      afterRelative: {
        interval: '5 days',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        dueForHygieneDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 15, 0, 0, 0).toISOString(),
              new Date(2018, 5, 20, 23, 59, 59, 999).toISOString(),
            ],
          }],
        },
      },
    });
  });


  it('after and before relative', () => {
    expect(dueForHygieneQuery({
      afterRelative: {
        interval: '5 days',
        date: '2018-06-15',
      },
      beforeRelative: {
        interval: '10 day',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        dueForHygieneDate: {
          $and: [
            {
              $between: [
                new Date(2018, 5, 15, 0, 0, 0).toISOString(),
                new Date(2018, 5, 20, 23, 59, 59, 999).toISOString(),
              ],
            },
            {
              $between: [
                new Date(2018, 5, 5, 0, 0, 0).toISOString(),
                new Date(2018, 5, 15, 23, 59, 59, 999).toISOString(),
              ],
            },
          ],
        },
      },
    });
  });

  it('raw', () => {
    expect(dueForHygieneQuery({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        dueForHygieneDate: {
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
    expect(dueForHygieneQuery({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '10 day',
        date: '2018-07-15',
      },
    }))
      .toEqual({
        where: {
          dueForHygieneDate: {
            $and: [
              { $lt: new Date(2018, 11, 20).toISOString() },
              {
                $between: [
                  new Date(2018, 6, 5, 0, 0, 0).toISOString(),
                  new Date(2018, 6, 15, 23, 59, 59, 999).toISOString(),
                ],
              },
            ],
          },
        },
      });
  });
});
