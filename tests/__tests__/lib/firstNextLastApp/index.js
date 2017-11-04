
import {
  Appointment,
  Patient,
} from '../../../../server/_models';

import CalcFirstNextLastAppointment from '../../../../server/lib/firstNextLastAppointment';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

import { wipeAllModels } from '../../../_util/wipeModel';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('First Next Last Appointment Calculation', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#calcPatients First and Last Appointment', () => {
    test('should be a function', () => {
      expect(typeof CalcFirstNextLastAppointment).toBe('function');
    });

    let appointments;
    let patients;

    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatientData({firstName: 'Old', lastName: 'Patient'}),
        makePatientData({firstName: 'Recent', lastName: 'Patient'}),
      ]);

      appointments = await Appointment.bulkCreate([
        makeApptData({patientId: patients[0].id, ...dates(2014, 7, 5, 8)}),
        makeApptData({patientId: patients[1].id, ...dates(2016, 7, 5, 9)}),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should set patients firstApptId and lastApptId', () => {
      CalcFirstNextLastAppointment(appointments,
        async (currentPatient, firstApptId, nextApptId, lastApptId) => {
          await Patient.update({
            firstApptId,
            nextApptId,
            lastApptId,
          },
            {
              where: {
                id: currentPatient,
              },
            });

          const patient = await Patient.findOne({
            where: {
              id: currentPatient,
            },
            raw: true,
          });

          expect(patient.firstApptId).toBe(firstApptId);
          expect(patient.lastApptId).toBe(lastApptId);
      });
    });

    test('nextApptId should be null', async () => {
      CalcFirstNextLastAppointment(appointments,
        async (currentPatient, firstApptId, nextApptId, lastApptId) => {
          await Patient.update({
              firstApptId,
              nextApptId,
              lastApptId,
            },
            {
              where: {
                id: currentPatient,
              },
            });

          const patient = await Patient.findOne({
            where: {
              id: currentPatient,
            },
            raw: true,
          });

          expect(patient.nextApptId).toBe(null);
        });
    });
  });

  describe('#calcPatients Next Appointment', () => {
    let appointments;
    let patients;

    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatientData({firstName: 'Old', lastName: 'Patient'}),
      ]);

      appointments = await Appointment.bulkCreate([
        makeApptData({patientId: patients[0].id, ...dates(2018, 7, 5, 8)}),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should set nextApptId and firstApptId and lastApptId should be null', async () => {
      CalcFirstNextLastAppointment(appointments,
        async (currentPatient, firstApptId, nextApptId, lastApptId) => {
          await Patient.update({
              firstApptId,
              nextApptId,
              lastApptId,
            },
            {
              where: {
                id: currentPatient,
              },
            });

          const patient = await Patient.findOne({
            where: {
              id: currentPatient,
            },
            raw: true,
          });

          expect(patient.nextApptId).toBe(nextApptId);
          expect(patient.firstApptId).toBe(null);
          expect(patient.lastApptId).toBe(null);
        });
    });
  });

  describe('#calcPatients First/Next/Last Appointment', () => {
    let appointments;
    let patients;

    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatientData({firstName: 'Old', lastName: 'Patient'}),
      ]);

      appointments = await Appointment.bulkCreate([
        makeApptData({patientId: patients[0].id, ...dates(2018, 7, 5, 8)}),
        makeApptData({patientId: patients[0].id, ...dates(2015, 7, 5, 8)}),
        makeApptData({patientId: patients[0].id, ...dates(2016, 7, 5, 8)}),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should set nextApptId, firstApptId and lastApptId', async () => {
      CalcFirstNextLastAppointment(appointments,
        async (currentPatient, firstApptId, nextApptId, lastApptId) => {
          await Patient.update({
              firstApptId,
              nextApptId,
              lastApptId,
            },
            {
              where: {
                id: currentPatient,
              },
            });

          const patient = await Patient.findOne({
            where: {
              id: currentPatient,
            },
            raw: true,
          });

          expect(patient.nextApptId).toBe(nextApptId);
          expect(patient.firstApptId).toBe(firstApptId);
          expect(patient.firstApptId).not.toBe(lastApptId);
          expect(patient.lastApptId).toBe(lastApptId);
          expect(patient.lastApptId).not.toBe(firstApptId);
        });
    });
  });
});
