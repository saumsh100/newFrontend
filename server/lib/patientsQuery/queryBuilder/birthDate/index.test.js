
import queryBirthDate from './';

describe('Birth Date Query', () => {
  test('string', () => {
    expect(queryBirthDate('2018-01-24')).toEqual({
      where: {
        birthDate: {
          $between: [
            new Date(2018, 0, 24, 0, 0, 0).toISOString(),
            new Date(2018, 0, 24, 23, 59, 59, 999).toISOString(),
          ],
        },
      },
    });
  });

  test('between', () => {
    expect(queryBirthDate({
      between: [
        '2017-01-24',
        '2019-01-24',
      ],
    })).toEqual({
      where: {
        birthDate: {
          $and: [
            {
              $between: [
                new Date(2017, 0, 24, 0, 0, 0).toISOString(),
                new Date(2019, 0, 24, 23, 59, 59, 999).toISOString(),
              ],
            },
          ],
        },
      },
    });
  });

  test('before relative', () => {
    expect(queryBirthDate({
      beforeRelative: {
        interval: '5 days',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        birthDate: {
          $and: [{
            $between: [
              new Date(2018, 5, 10, 0, 0, 0).toISOString(),
              new Date(2018, 5, 15, 23, 59, 59, 999).toISOString(),
            ],
          }],
        },
      },
    });
  });

  it('after relative', () => {
    expect(queryBirthDate({
      afterRelative: {
        interval: '5 days',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        birthDate: {
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
    expect(queryBirthDate({
      afterRelative: {
        interval: '5 days',
        date: '2018-06-15',
      },
      beforeRelative: {
        interval: '10 day',
        date: '2018-07-15',
      },
    })).toEqual({
      where: {
        birthDate: {
          $and: [
            {
              $between: [
                new Date(2018, 5, 15, 0, 0, 0).toISOString(),
                new Date(2018, 5, 20, 23, 59, 59, 999).toISOString(),
              ],
            },
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

  it('raw', () => {
    expect(queryBirthDate({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        birthDate: {
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
    expect(queryBirthDate({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '10 day',
        date: '2018-07-15',
      },
    }))
      .toEqual({
        where: {
          birthDate: {
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

