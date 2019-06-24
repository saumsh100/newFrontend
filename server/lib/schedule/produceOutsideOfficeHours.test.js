
import { setDateToTimezone } from '@carecru/isomorphic';
import { WeeklySchedule, DailySchedule, Account, Template, AccountTemplate } from 'CareCruModels';
import { seedTestUsers, accountId } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import { patient, seedTestPatients } from '../../../tests/util/seedTestPatients';
import produceOutsideOfficeHours from './produceOutsideOfficeHours';

const date = (y, M, d, h) => (setDateToTimezone({
  y,
  M,
  d,
  h,
}, 'America/Vancouver')).toISOString();

describe('lib.schedule.produceOutsideOfficeHours', () => {
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    jest.spyOn(Date, 'now');
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  it.skip('respond later today', async () => {
    Date.now.mockReturnValue(setDateToTimezone('2018-10-30 05:00', 'America/Vancouver').valueOf());

    const [{ id: openDayId }, { id: closedDayId }] = await DailySchedule.bulkCreate([
      {
        startTime: date(1970, 1, 1, 9),
        endTime: date(1970, 1, 1, 17),
        accountId,
      },
      {
        startTime: date(1970, 1, 1, 20),
        endTime: date(1970, 1, 1, 23),
        closed: true,
        accountId,
      },
    ]);

    const weeklySchedule = await WeeklySchedule.create({
      accountId,
      mondayId: openDayId,
      tuesdayId: openDayId,
      wednesdayId: closedDayId,
      thursdayId: openDayId,
      fridayId: openDayId,
      saturdayId: closedDayId,
      sundayId: closedDayId,
      isAdvanced: false,
    });

    const account = await Account.findByPk(accountId);

    await account.update({
      weeklyScheduleId: weeklySchedule.get('id'),
      canAutoRespondOutsideOfficeHours: true,
      bufferBeforeOpening: '-15 minutes',
      bufferAfterClosing: '15 minutes',
    });

    const template = await Template.create({
      templateName: 'donna-respond-outside-office-hours',
      values: {
        'account.name': true,
        nextOpenedTime: true,
      },
    });
    await AccountTemplate.create({
      templateId: template.get('id'),
      value: 'Test default template message for: ${account.name}. You have access to the nextOpenedTime value as well, which is "${nextOpenedTime}".',
    });

    const result = await produceOutsideOfficeHours(
      account.get({ plain: true }),
      patient.mobilePhoneNumber,
    );

    expect(result).toBe('Test default template message for: Test Account. You have access to the nextOpenedTime value as well, which is "at 08:45am".');
  });

  it.skip('respond early tomorrow', async () => {
    Date.now.mockReturnValue(setDateToTimezone('2018-10-30 05:00', 'America/Vancouver').valueOf());
    const [{ id: openDayId }, { id: closedDayId }] = await DailySchedule.bulkCreate([
      {
        startTime: date(1970, 1, 1, 23),
        endTime: date(1970, 1, 1, 17),
        accountId,
      },
      {
        startTime: date(1970, 1, 1, 10),
        endTime: date(1970, 1, 1, 23),
        closed: true,
        accountId,
      },
    ]);

    const weeklySchedule = await WeeklySchedule.create({
      accountId,
      mondayId: openDayId,
      tuesdayId: openDayId,
      wednesdayId: closedDayId,
      thursdayId: openDayId,
      fridayId: openDayId,
      saturdayId: closedDayId,
      sundayId: closedDayId,
      isAdvanced: false,
    });

    const account = await Account.findByPk(accountId);

    await account.update({
      weeklyScheduleId: weeklySchedule.get('id'),
      canAutoRespondOutsideOfficeHours: true,
      bufferBeforeOpening: '-15 minutes',
      bufferAfterClosing: '15 minutes',
    });

    const template = await Template.create({
      templateName: 'donna-respond-outside-office-hours',
      values: {
        'account.name': true,
        nextOpenedTime: true,
      },
    });
    await AccountTemplate.create({
      templateId: template.get('id'),
      value: 'Test default template message for: ${account.name}. You have access to the nextOpenedTime value as well, which is "${nextOpenedTime}".',
    });

    const result = await produceOutsideOfficeHours(
      account.get({ plain: true }),
      patient.mobilePhoneNumber,
    );

    expect(result).toBe('Test default template message for: Test Account. You have access to the nextOpenedTime value as well, which is "tomorrow morning at 09:45am".');
  });

  it.skip('respond late tomorrow', async () => {
    Date.now.mockReturnValue(setDateToTimezone('2018-10-30 05:00', 'America/Vancouver').valueOf());
    const [{ id: openDayId }, { id: closedDayId }] = await DailySchedule.bulkCreate([
      {
        startTime: date(1970, 1, 1, 23),
        endTime: date(1970, 1, 1, 17),
        accountId,
      },
      {
        startTime: date(1970, 1, 1, 19),
        endTime: date(1970, 1, 1, 23),
        closed: true,
        accountId,
      },
    ]);

    const weeklySchedule = await WeeklySchedule.create({
      accountId,
      mondayId: openDayId,
      tuesdayId: openDayId,
      wednesdayId: closedDayId,
      thursdayId: openDayId,
      fridayId: openDayId,
      saturdayId: closedDayId,
      sundayId: closedDayId,
      isAdvanced: false,
    });

    const account = await Account.findByPk(accountId);

    await account.update({
      weeklyScheduleId: weeklySchedule.get('id'),
      canAutoRespondOutsideOfficeHours: true,
      bufferBeforeOpening: '-15 minutes',
      bufferAfterClosing: '15 minutes',
    });

    const template = await Template.create({
      templateName: 'donna-respond-outside-office-hours',
      values: {
        'account.name': true,
        nextOpenedTime: true,
      },
    });
    await AccountTemplate.create({
      templateId: template.get('id'),
      value: 'Test default template message for: ${account.name}. You have access to the nextOpenedTime value as well, which is "${nextOpenedTime}".',
    });

    const result = await produceOutsideOfficeHours(
      account.get({ plain: true }),
      patient.mobilePhoneNumber,
    );

    expect(result).toBe('Test default template message for: Test Account. You have access to the nextOpenedTime value as well, which is "tomorrow evening at 06:45pm".');
  });

  it('respond in office hours', async () => {
    const [{ id: openDayId }, { id: closedDayId }] = await DailySchedule.bulkCreate([
      {
        startTime: date(1970, 1, 1, 8),
        endTime: date(1970, 1, 1, 17),
        accountId,
      },
      {
        startTime: date(1970, 1, 1, 8),
        endTime: date(1970, 1, 1, 17),
        closed: true,
        accountId,
      },
    ]);

    const weeklySchedule = await WeeklySchedule.create({
      accountId,
      mondayId: openDayId,
      tuesdayId: openDayId,
      wednesdayId: closedDayId,
      thursdayId: openDayId,
      fridayId: openDayId,
      saturdayId: closedDayId,
      sundayId: closedDayId,
      isAdvanced: false,
    });

    const account = await Account.findByPk(accountId);

    await account.update({
      weeklyScheduleId: weeklySchedule.get('id'),
      canAutoRespondOutsideOfficeHours: true,
      bufferBeforeOpening: '30 minutes',
      bufferAfterClosing: '-30 minutes',
    });

    Date.now.mockReturnValue(setDateToTimezone('2018-10-30 13:00', 'America/Vancouver').valueOf());

    const result = await produceOutsideOfficeHours(
      account.get({ plain: true }),
      patient.mobilePhoneNumber,
    );

    expect(result).toBe(false);
  });

  it('respond is disabled', async () => {
    const [{ id: openDayId }, { id: closedDayId }] = await DailySchedule.bulkCreate([
      {
        startTime: date(1970, 1, 1, 8),
        endTime: date(1970, 1, 1, 17),
        accountId,
      },
      {
        startTime: date(1970, 1, 1, 8),
        endTime: date(1970, 1, 1, 17),
        closed: true,
        accountId,
      },
    ]);

    const weeklySchedule = await WeeklySchedule.create({
      accountId,
      mondayId: openDayId,
      tuesdayId: openDayId,
      wednesdayId: closedDayId,
      thursdayId: openDayId,
      fridayId: openDayId,
      saturdayId: closedDayId,
      sundayId: closedDayId,
      isAdvanced: false,
    });

    const account = await Account.findByPk(accountId);
    await account.update({
      weeklyScheduleId: weeklySchedule.get('id'),
      canAutoRespondOutsideOfficeHours: false,
    });

    const result = await produceOutsideOfficeHours(
      account.get({ plain: true }),
      patient.mobilePhoneNumber,
    );

    expect(result).toBe(false);
  });
});
