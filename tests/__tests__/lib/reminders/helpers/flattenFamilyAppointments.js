
import orderBy from 'lodash/orderBy';
import { v4 as uuid } from 'uuid';
import flattenFamilyAppointments from '../../../../../server/lib/reminders/flattenFamilyAppointments';

// TODO: remove this?
// const TIME_ZONE = 'America/Vancouver';
const accountId = 'Test Clinic';

const makeApptData = (data = {}) => Object.assign({
  id: uuid(),
  accountId,
}, data);

const makeFamilyData = (data = {}) => Object.assign({
  id: uuid(),
  accountId,
}, data);

const makePatientData = (data = {}) =>
  ({
    id: uuid(),
    accountId,
    firstName: data.n,
    lastName: data.n,
    cellPhoneNumber: data.mobilePhoneNumber,
    ...data,
  });

const date = (y, m, d, h, mi = 0) => (new Date(y, m, d, h, mi)).toISOString();
const dates = (y, m, d, h, mi) => {
  return {
    startDate: date(y, m, d, h, mi),
    endDate: date(y, m, d, h + 1, mi),
  };
};

const order = success => orderBy(orderBy(success, s => s.primaryType), s => s.patient.firstName);

describe('Reminders Calculation Library', () => {
  describe('#flattenFamilyAppointments', () => {
    let reminder;
    let patients;
    let families;
    let appointments;
    beforeEach(async () => {
      reminder = {
        accountId,
        primaryTypes: ['email', 'sms'],
        interval: '2 hours',
      };

      families = [
        makeFamilyData({ note: 'Jones Family' }),
        makeFamilyData({ note: 'Random Guy' }),
      ];

      patients = [
        makePatientData({ n: 'Mom', email: 'moms@rock.xyz', mobilePhoneNumber: '+12223334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
        makePatientData({ n: 'Dad', email: 'dads@rcool.xyz', mobilePhoneNumber: '+13334445555', familyId: families[0].id, pmsCreatedAt: new Date(2018, 2, 1) }),
        makePatientData({ n: 'Daughter', email: 'daughters@rweet.xyz', mobilePhoneNumber: '+12223334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 3, 1) }),
        makePatientData({ n: 'Son', email: 'moms@rock.xyz', mobilePhoneNumber: '+12223334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
        makePatientData({ n: 'Joe', email: 'average@joe.ca', mobilePhoneNumber: '+18887776666', pmsCreatedAt: new Date(2018, 2, 1) }),
      ];

      // Make Mom the head of the family
      families[0].headId = patients[0].id;

      appointments = [
        // Monday
        makeApptData({ ...dates(2018, 9, 10, 8), patientId: patients[0].id }), // Mom @ 8:00am
        makeApptData({ ...dates(2018, 9, 10, 8), patientId: patients[4].id }), // Joe @ 8:00am
        makeApptData({ ...dates(2018, 9, 10, 8, 30), patientId: patients[3].id }), // Son @ 8:30am
        makeApptData({ ...dates(2018, 9, 10, 8, 45), patientId: patients[1].id }), // Dad @ 8:45am
        makeApptData({ ...dates(2018, 9, 10, 13), patientId: patients[0].id }), // Mom @ 1:00pm
        makeApptData({ ...dates(2018, 9, 10, 13, 30), patientId: patients[2].id }), // Daughter @ 1:30pm
        makeApptData({ ...dates(2018, 9, 10, 13, 45), patientId: patients[2].id }), // Daughter @ 1:45pm
        makeApptData({ ...dates(2018, 9, 10, 16), patientId: patients[2].id }), // Daughter @ 4:00pm
      ];
    });

    test('should be a function', () => {
      expect(typeof flattenFamilyAppointments).toBe('function');
    });

    test('should return no extra appointments for a patient with no family', () => {
      const appointment = {
        ...appointments[1],
        patient: {
          ...patients[4],
        },
      };

      const appts = flattenFamilyAppointments({ appointment, reminder });
      expect(appts.length).toBe(1);
      expect(appts[0].id).toBe(appointments[1].id);
    });

    test('should return no extra appointments for a family that has no other patients', () => {
      const appointment = {
        ...appointments[1],
        patient: {
          ...patients[4],
          family: {
            ...families[1],
            headId: patients[4].id,
            patients: [
              patients[4],
            ],
          },
        },
      };

      const appts = flattenFamilyAppointments({ appointment, reminder });
      expect(appts.length).toBe(1);
      expect(appts[0].id).toBe(appointments[1].id);
    });

    test('should return 2 extra appointments for a family that has 2 other patients with appointments', () => {
      const appointment = {
        ...appointments[0],
        patient: {
          ...patients[0],
          family: {
            ...families[0],
            patients: [
              { ...patients[0], appointments: [appointments[0]] },
              { ...patients[1], appointments: [appointments[3]] },
              { ...patients[2], appointments: [appointments[5], appointments[6]] },
              { ...patients[3], appointments: [appointments[2]] },
            ],
          },
        },
      };

      const appts = flattenFamilyAppointments({ appointment, reminder });
      expect(appts.length).toBe(3);
      expect(appts[0].id).toBe(appointments[0].id);
      expect(appts[1].id).toBe(appointments[2].id);
      expect(appts[2].id).toBe(appointments[5].id);
    });

    test('should return only 1 extra appointments for a family that has 2 other patients with appointments but only email channel applies', () => {
      const appointment = {
        ...appointments[0],
        patient: {
          ...patients[0],
          family: {
            ...families[0],
            patients: [
              { ...patients[0], appointments: [appointments[0]] },
              { ...patients[1], appointments: [appointments[3]] },
              { ...patients[2], appointments: [appointments[5], appointments[6]] },
              { ...patients[3], appointments: [appointments[2]] },
            ],
          },
        },
      };

      reminder.primaryTypes = ['email'];

      const appts = flattenFamilyAppointments({ appointment, reminder });
      expect(appts.length).toBe(2);
      expect(appts[0].id).toBe(appointments[0].id);
      expect(appts[1].id).toBe(appointments[2].id);
    });

    test('should work with patients and that have no email', () => {
      const appointment = {
        ...appointments[0],
        patient: {
          ...patients[0],
          email: null,
          family: {
            ...families[0],
            patients: [
              { ...patients[0], appointments: [appointments[0]], email: null },
              { ...patients[1], appointments: [appointments[3]] },
              { ...patients[2], appointments: [appointments[5], appointments[6]], email: null },
              { ...patients[3], appointments: [appointments[2]], email: '1' },
            ],
          },
        },
      };

      reminder.primaryTypes = ['email'];

      const appts = flattenFamilyAppointments({ appointment, reminder });
      expect(appts.length).toBe(2);
      expect(appts[0].id).toBe(appointments[0].id);
      expect(appts[1].id).toBe(appointments[5].id);
    });
  });
});
