
import { Account, Appointment, Chair, Practitioner } from '../../../server/_models';
import { omitProperties } from '../../util/selectors';
import { wipeTestUsers, seedTestUsers, accountId } from '../../util/seedTestUsers';
import globals from '../../../server/config/globals';

const spyGet = jest.spyOn(globals.reminders, 'get');
const practitionerId = '88a2d812-3a4c-454c-9286-628556563bdc';
const makeData = (data = {}) => ({
  accountId,
  practitionerId,
  startDate: (new Date(2017, 1, 1, 8, 30)).toISOString(),
  endDate: (new Date(2017, 1, 1, 9, 30)).toISOString(),
  ...data,
});

const makePractitionerData = (data = {}) => Object.assign({
  id: practitionerId,
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
}, data);

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';
describe('models/Appointment', () => {
  beforeEach(async () => {
    await wipeTestUsers();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeTestUsers();
    await seedTestUsers();
  });

  describe('Data Validation', () => {
    test('should be able to save a Appointment without id provided', async () => {
      const data = makeData();
      await Practitioner.create(makePractitionerData());
      const appointment = await Appointment.create(data);
      expect(omitProperties(appointment.dataValues, ['id']))
        .toMatchSnapshot();
    });

    test('should have default values', async () => {
      const data = makeData();
      await Practitioner.create(makePractitionerData());
      const appointment = await Appointment.create(data);
      expect(appointment.isDeleted)
        .toBe(false);
      expect(appointment.isPatientConfirmed)
        .toBe(false);
    });

    test('should throw error for no startDate provided', async () => {
      const data = makeData({ startDate: undefined });
      await Practitioner.create(makePractitionerData());
      try {
        await Appointment.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name)
          .toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Appointment.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name)
          .toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    beforeEach(async () => {
      await seedTestUsers();
    });

    test('should be able to fetch account relationship', async () => {
      await Practitioner.create(makePractitionerData());
      const { id } = await Appointment.create(makeData());

      const appointment = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(appointment.accountId)
        .toBe(appointment.account.id);
    });

    test('should not fail if you are trying to join a chair if chairId is null', async () => {
      await Practitioner.create(makePractitionerData());
      const { id } = await Appointment.create(makeData());

      const a = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: Chair,
            as: 'chair',
          },
        ],
      });

      expect(a.chair)
        .toBe(null);
    });
  });

  describe('#batchSave', () => {
    test('should be able to save 2 appointments', async () => {
      await Practitioner.create(makePractitionerData());
      const appts = await Appointment.batchSave([
        makeData(),
        makeData(),
      ]);

      expect(appts.length)
        .toBe(2);
    });

    test('should fail validation for 1 and save the other', async () => {
      await Practitioner.create(makePractitionerData());
      try {
        await Appointment.batchSave([
          makeData(),
          makeData({ practitionerId: null }),
          makeData({ startDate: null }),
        ]);
      } catch ({ docs, errors }) {
        expect(docs.length)
          .toBe(1);
        expect(errors.length)
          .toBe(2);
        expect(errors[0].name)
          .toBe('SequelizeValidationError');
        expect(errors[1].name)
          .toBe('SequelizeValidationError');
      }
    });
  });
  describe('Confirmation', () => {
    beforeEach(async () => {
      await Practitioner.create(makePractitionerData());
      globals.reminders.set('sameDayWindowHours', 6);
    });

    afterEach(() => {
      spyGet.mockClear();
    });

    test('should confirm 2 appointments using the default globals.windowHours of 6 hours', async () => {
      const appointment1 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 6, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 7, 0)).toISOString(),
      }));
      const appointment2 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 8, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 9, 0)).toISOString(),
      }));
      const appointment3 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 16, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 17, 0)).toISOString(),
      }));

      await appointment1.confirm({ isCustomConfirm: false });

      const appointments = await Appointment.findAll({
        where: { id: [appointment1.id, appointment2.id, appointment3.id] },
        order: [['startDate', 'ASC']],
        attributes: ['isPatientConfirmed'],
        raw: true,
      });
      const mappedAppointments = appointments.map(e => e.isPatientConfirmed);

      expect(mappedAppointments)
        .toHaveLength(3);
      expect(mappedAppointments)
        .toEqual([true, true, false]);
      expect(spyGet).toHaveBeenCalledTimes(1);
      expect(spyGet('sameDayWindowHours')).toBe(6);
    });

    test('should confirm 2 appointments using a mocked default globals.windowHours of 8 hours', async () => {
      globals.reminders.set('sameDayWindowHours', 8);
      const appointment1 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 6, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 7, 0)).toISOString(),
      }));
      const appointment2 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 8, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 9, 0)).toISOString(),
      }));
      const appointment3 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 16, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 17, 0)).toISOString(),
      }));

      await appointment2.confirm({ isCustomConfirm: false });

      const appointments = await Appointment.findAll({
        where: { id: [appointment1.id, appointment2.id, appointment3.id] },
        order: [['startDate', 'ASC']],
        attributes: ['isPatientConfirmed'],
        raw: true,
      });
      const mappedAppointments = appointments.map(e => e.isPatientConfirmed);

      expect(mappedAppointments)
        .toHaveLength(3);
      expect(mappedAppointments)
        .toEqual([false, true, true]);
      expect(spyGet).toHaveBeenCalledTimes(1);
      expect(spyGet('sameDayWindowHours')).toBe(8);
    });

    test('should only confirm 1 appointment using the default globals.windowHours of 6 hours', async () => {
      const appointment1 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 6, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 7, 0)).toISOString(),
      }));
      const appointment2 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 8, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 9, 0)).toISOString(),
      }));
      const appointment3 = await Appointment.create(makeData({
        startDate: (new Date(2017, 1, 1, 16, 0)).toISOString(),
        endDate: (new Date(2017, 1, 1, 17, 0)).toISOString(),
      }));

      await appointment3.confirm({ isCustomConfirm: false });

      const appointments = await Appointment.findAll({
        where: { id: [appointment1.id, appointment2.id, appointment3.id] },
        order: [['startDate', 'ASC']],
        attributes: ['isPatientConfirmed'],
        raw: true,
      });
      const mappedAppointments = appointments.map(e => e.isPatientConfirmed);

      expect(mappedAppointments)
        .toHaveLength(3);
      expect(mappedAppointments)
        .toEqual([false, false, true]);
      expect(spyGet).toHaveBeenCalledTimes(1);
      expect(spyGet('sameDayWindowHours')).toBe(6);
    });
  });
});
