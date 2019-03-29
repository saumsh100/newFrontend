
import { SentReminder } from 'CareCruModels';
import queryNotSentReminders from './';

describe('queryNotSentRemindersTest', () => {
  test('should build the inner include clause of query for not sentReminders between the dates when dates are passed to the query', () => {
    expect(
      queryNotSentReminders([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].include[0],
    ).toEqual({
      model: SentReminder,
      as: 'sentReminder',
      required: false,
      duplicating: false,
      attributes: [],
      where: {
        createdAt: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
      },
    });
  });

  test('should build the where clause of the inner include clause of query for not isAutomated isSent reminders between dates when dates are passed and isAutomated = false is passed to the query', () => {
    expect(
      queryNotSentReminders([
        false,
        false,
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
      isAutomated: false,
    });
  });

  test('should build the group clause of query for not sent reminders when query parameters are valid', () => {
    expect(
      queryNotSentReminders([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).group[0],
    ).toEqual('Patient.id');
  });

  test('should build the having clause of query for not isSent reminders when query parameters are valid', () => {
    expect(
      queryNotSentReminders([
        false,
        true,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).having[1],
    ).toEqual({
      attribute: {
        val:
          'count(CASE WHEN "sentRemindersPatients->sentReminder"."isSent" = true then 1 else NULL END)',
      },
      comparator: '=',
      logic: { $eq: 0 },
    });
  });

  test('should build the required clause of the inner include clause of the query to be true when query is valid', () => {
    expect(
      queryNotSentReminders([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].include[0].required,
    ).toBeFalsy();
  });

  test('should build the required clause of the outer include clause of the query to be true when query is valid', () => {
    expect(
      queryNotSentReminders([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].required,
    ).toBeFalsy();
  });
});
