
import moment from 'moment';
import {
  Account,
  Appointment,
  AppointmentCode,
  Patient,
  PatientRecall,
} from '../../../../server/_models';
import updatePatientDueDatesForAllAccounts from '../../../../server/lib/dueDate';
import {
  updateAccountConnectorConfigurations,
} from '../../../../server/lib/accountConnectorConfigurations';
import {
  updateAccountCronConfigurations,
} from '../../../../server/lib/AccountCronConfigurations';
import { seedTestUsers, accountId, addressId, enterpriseId } from '../../../util/seedTestUsers';
import { patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { wipeAllModels } from '../../../util/wipeModel';

const DEFAULT_TYPE = 'HYGIENE';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
  reason: DEFAULT_TYPE,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
  lastHygieneDate: moment('2018-01-11 08:00:00').toISOString(),
  lastRecallDate: moment('2018-01-11 08:00:00').toISOString(),
}, data);

const dates = d => ({
  startDate: moment(d).toISOString(),
  endDate: moment(d).add(1, 'hours').toISOString(),
  originalDate: moment(d).toISOString(),
});

describe('Due Date Job - updatePatientDueDatesForAllAccounts', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#updatePatientDueDatesForAllAccounts', () => {
    test('should be a function', () => {
      expect(typeof updatePatientDueDatesForAllAccounts).toBe('function');
    });

    describe('1 Tracker and 1 Dentrix Clinic', () => {
      let newAccount;
      let patients;
      let appointments;
      let appointmentCodes;
      beforeEach(async () => {
        newAccount = await Account.create({
          enterpriseId,
          name: 'Dentricio Dental',
          addressId,
          recallInterval: '6 months',
          hygieneInterval: '6 months',
        });

        await updateAccountConnectorConfigurations({ name: 'ADAPTER_TYPE', value: 'TRACKER_11' }, accountId);
        await updateAccountConnectorConfigurations({ name: 'ADAPTER_TYPE', value: 'DENTRIX_G6' }, newAccount.id);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'A', lastName: 'B' }),
          makePatientData({ accountId: newAccount.id, firstName: 'C', lastName: 'D' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates('2018-07-12 08:00:00'), isPending: true }),
        ]);

        appointmentCodes = await AppointmentCode.bulkCreate([
          { appointmentId: appointments[0].id, code: '11111' },
        ]);
      });

      test('should update 1 patient on tracker clinic and 1 patient on the dentrix clinic', async () => {
        await updatePatientDueDatesForAllAccounts({ date: (new Date()).toISOString() });
        const trackerPatient = await Patient.findById(patients[0].id);
        const dentrixPatient = await Patient.findById(patients[1].id);
        expect(trackerPatient.dueForHygieneDate.toISOString()).toBe(moment('2018-07-12 08:00:00').toISOString());
        expect(trackerPatient.dueForRecallExamDate).toBe(null);
        expect(dentrixPatient.dueForHygieneDate.toISOString()).toBe(moment('2018-07-11 08:00:00').toISOString());
        expect(dentrixPatient.dueForRecallExamDate.toISOString()).toBe(moment('2018-07-11 08:00:00').toISOString());
      });

      test('should update 1 patient on tracker clinic and 1 patient on the dentrix clinic with cronDate populated', async () => {
        const d = moment('2018-01-11 08:00:00').toISOString();
        await updateAccountCronConfigurations({ name: 'CRON_DUE_DATE', value: d }, accountId);
        await updateAccountCronConfigurations({ name: 'CRON_DUE_DATE', value: d }, newAccount.id);
        await updatePatientDueDatesForAllAccounts({ date: (new Date()).toISOString() });
        const trackerPatient = await Patient.findById(patients[0].id);
        const dentrixPatient = await Patient.findById(patients[1].id);
        expect(trackerPatient.dueForHygieneDate.toISOString()).toBe(moment('2018-07-12 08:00:00').toISOString());
        expect(trackerPatient.dueForRecallExamDate).toBe(null);
        expect(dentrixPatient.dueForHygieneDate.toISOString()).toBe(moment('2018-07-11 08:00:00').toISOString());
        expect(dentrixPatient.dueForRecallExamDate.toISOString()).toBe(moment('2018-07-11 08:00:00').toISOString());
      });
    });
  });
});
