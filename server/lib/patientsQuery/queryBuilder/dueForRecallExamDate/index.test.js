
import dueForRecallExamDateQuery from './';

describe('Due For Recall Exam Query', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1));
  });

  test('between', () => {
    expect(dueForRecallExamDateQuery([
      '2017-02-01',
      '2019-02-01',
    ])).toEqual({
      where: {
        dueForRecallExamDate: {
          $between: [
            new Date(2017, 1, 1, 0, 0, 0).toISOString(),
            new Date(2019, 1, 1, 23, 59, 59, 999).toISOString(),
          ],
        },
      },
    });
  });

  test('before relative', () => {
    expect(dueForRecallExamDateQuery({
      beforeRelative: {
        interval: '10 day',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        dueForRecallExamDate: {
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
    expect(dueForRecallExamDateQuery({
      afterRelative: {
        interval: '5 days',
        date: '2018-06-15',
      },
    })).toEqual({
      where: {
        dueForRecallExamDate: {
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
    expect(dueForRecallExamDateQuery({
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
        dueForRecallExamDate: {
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
    expect(dueForRecallExamDateQuery({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      where: {
        dueForRecallExamDate: {
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
    expect(dueForRecallExamDateQuery({
      $lt: new Date(2018, 11, 20).toISOString(),
      beforeRelative: {
        interval: '10 day',
        date: '2018-07-15',
      },
    }))
      .toEqual({
        where: {
          dueForRecallExamDate: {
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
