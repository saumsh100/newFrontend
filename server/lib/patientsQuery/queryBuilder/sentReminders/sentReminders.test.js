
import { SentReminder } from 'CareCruModels';
import querySentReminders from './';

describe('querySentRemindersTest', () => {
  test('should build the where clause of the inner include clause of query for isSent reminders between the dates when dates are passed to the query', () => {
    expect(
      querySentReminders([
        true,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].include[0].where,
    ).toEqual({
      createdAt: {
        $between: [
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      },
      isSent: true,
    });
  });

  test('should build the where clause of the inner include clause of query for isAutomated isSent reminders between dates when dates are passed and isAutomated = true is passed to the query', () => {
    expect(
      querySentReminders([
        true,
        true,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].include[0].where,
    ).toEqual({
      createdAt: {
        $between: [
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      },
      isSent: true,
      isAutomated: true,
    });
  });

  test('should build the inner include clause of query for sentReminders between the dates when dates are passed to the query', () => {
    expect(
      querySentReminders([
        true,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].include[0],
    ).toEqual({
      model: SentReminder,
      as: 'sentReminder',
      required: true,
      duplicating: false,
      attributes: [],
      where: {
        createdAt: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
        isSent: true,
      },
    });
  });

  test('should build the required clause of the inner include clause of the query to be true when query is valid', () => {
    expect(
      querySentReminders([
        true,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].include[0].required,
    ).toBeTruthy();
  });

  test('should build the required clause of the outer include clause of the query to be true when query is valid', () => {
    expect(
      querySentReminders([
        true,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].required,
    ).toBeTruthy();
  });
});
