
import { Patient, Family } from 'CareCruModels';
import {
  date,
  clone,
} from '../../../util/contactInfoSeedingData';
import groupPatientsByChannelPoc from '../../../../server/lib/contactInfo/groupPatientsByChannelPoc';

describe('Contact Info Service', () => {
  describe('#groupPatientsByChannelPoc', () => {
    test('should be a function', () => {
      expect(typeof groupPatientsByChannelPoc).toBe('function');
    });

    test('should return the mom with the son as dependant', () => {
      // a mom and her 4 year old son and 6 year old daughter share a mobilePhoneNumber for sms
      // channel but only mom and son are in the array and Joe Black. Return the mom with the
      // son in the otherPatient an Joe Black
      let fetchedPatients = [
        new Patient({
          firstName: 'Mom',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Son',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Daughter',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
      ];
      const jonesFamily = new Family({ pmsCreatedAt: date(1, 1) });
      jonesFamily.headId = fetchedPatients[0].id;
      fetchedPatients = fetchedPatients.map((p) => {
        p.family = clone(jonesFamily);
        p.familyId = jonesFamily.id;
        return p;
      });

      const { errors, success } = groupPatientsByChannelPoc({
        patients: [
          clone(fetchedPatients[0].get({ plain: true })),
          clone(fetchedPatients[1].get({ plain: true })),
        ],
        fetchedPatients,
        channel: 'sms',
      });

      expect(errors.length).toBe(0);
      expect(success.length).toBe(1);
      expect(success[0].patient.firstName).toBe('Mom');
      expect(success[0].dependants.length).toBe(1);
      expect(success[0].dependants[0].firstName).toBe('Son');
    });

    test('should return the mom with the son as dependant grouping by different fields', () => {
      // Poc grouping should work using otherPhoneNumber and homePhoneNumber
      let fetchedPatients = [
        new Patient({
          firstName: 'Mom',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Son',
          otherPhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Daughter',
          homePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
      ];
      const jonesFamily = new Family({ pmsCreatedAt: date(1, 1) });
      jonesFamily.headId = fetchedPatients[0].id;
      fetchedPatients = fetchedPatients.map((p) => {
        p.family = clone(jonesFamily);
        p.familyId = jonesFamily.id;
        return p;
      });

      const { errors, success } = groupPatientsByChannelPoc({
        patients: [
          clone(fetchedPatients[1].get({ plain: true })),
          clone(fetchedPatients[2].get({ plain: true })),
        ],
        fetchedPatients,
        channel: 'sms',
      });

      expect(errors).toHaveLength(0);
      expect(success).toHaveLength(1);
      expect(success[0].patient.firstName).toBe('Mom');
      expect(success[0].dependants).toHaveLength(2);
      expect(success[0].dependants[0].firstName).toBe('Son');
    });

    test('should return the mom with the son, and the otherPatient also', () => {
      // just the son now is in the array. Return the mom with the son in the otherPatient
      let fetchedPatients = [
        new Patient({
          firstName: 'Mom',
          mobilePhoneNumber: '+12223334444',
          cellPhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Son',
          mobilePhoneNumber: '+12223334444',
          cellPhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Daughter',
          mobilePhoneNumber: '+12223334444',
          cellPhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Jack',
          mobilePhoneNumber: '+13334445555',
          cellPhoneNumber: '+13334445555',
          pmsCreatedAt: date(1, 2),
        }),
      ];

      const jonesFamily = new Family({ pmsCreatedAt: date(1, 1) });
      const blackFamily = new Family({ pmsCreatedAt: date(1, 2) });
      jonesFamily.headId = fetchedPatients[0].id;
      blackFamily.headId = fetchedPatients[3].id;
      fetchedPatients = fetchedPatients.map((p) => {
        p.family = clone(jonesFamily);
        p.familyId = jonesFamily.id;
        return p;
      });

      fetchedPatients[3].family = clone(blackFamily);
      fetchedPatients[3].familyId = blackFamily.id;
      const { errors, success } = groupPatientsByChannelPoc({
        patients: [
          clone(fetchedPatients[1].get({ plain: true })),
          clone(fetchedPatients[3].get({ plain: true })),
        ],
        fetchedPatients,
        channel: 'sms',
      });

      expect(errors.length).toBe(0);
      expect(success.length).toBe(2);
      expect(success[0].patient.firstName).toBe('Mom');
      expect(success[0].dependants.length).toBe(1);
      expect(success[0].dependants[0].firstName).toBe('Son');
      expect(success[1].patient.firstName).toBe('Jack');
      expect(success[1].dependants.length).toBe(0);
    });

    test('should return them all separate with no groupings', () => {
      // a dad and his 2 daughters 18 and 20 year old all have separate emails. Return them all
      // separate with no groupings
      let fetchedPatients = [
        new Patient({
          firstName: 'Dad',
          mobilePhoneNumber: '+12223334444',
          cellPhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Daughter1',
          mobilePhoneNumber: '+13334445555',
          cellPhoneNumber: '+13334445555',
          pmsCreatedAt: date(1, 1),
        }),
        new Patient({
          firstName: 'Daughter2',
          mobilePhoneNumber: '+14445556666',
          cellPhoneNumber: '+14445556666',
          pmsCreatedAt: date(1, 1),
        }),
      ];

      const jamesFamily = new Family({ pmsCreatedAt: date(1, 1) });
      jamesFamily.headId = fetchedPatients[0].id;
      fetchedPatients = fetchedPatients.map((p) => {
        p.family = clone(jamesFamily);
        p.familyId = jamesFamily.id;
        return p;
      });

      const { errors, success } = groupPatientsByChannelPoc({
        patients: [
          clone(fetchedPatients[0].get({ plain: true })),
          clone(fetchedPatients[1].get({ plain: true })),
          clone(fetchedPatients[2].get({ plain: true })),
        ],
        fetchedPatients,
        channel: 'sms',
      });
      expect(errors.length).toBe(0);
      expect(success.length).toBe(3);
      expect(success[0].patient.firstName).toBe('Dad');
      expect(success[0].dependants.length).toBe(0);
      expect(success[1].patient.firstName).toBe('Daughter1');
      expect(success[1].dependants.length).toBe(0);
      expect(success[2].patient.firstName).toBe('Daughter2');
      expect(success[2].dependants.length).toBe(0);
    });

    test(`should return Joe Black as he and his family are newer but also an error because of 
    John Doe not being PoC`, () => {
      // a dad and his 2 daughters 18 and 20 year old all have separate emails. Return them all
      // separate with no groupings
      const fetchedPatients = [
        new Patient({
          firstName: 'Jack',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(3, 1),
        }),
        new Patient({
          firstName: 'John',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
      ];

      const blackFamily = new Family({ pmsCreatedAt: date(3, 1) });
      const doeFamily = new Family({ pmsCreatedAt: date(1, 1) });

      blackFamily.headId = fetchedPatients[0].id;
      fetchedPatients[0].family = clone(blackFamily);
      fetchedPatients[0].familyId = blackFamily.id;

      doeFamily.headId = fetchedPatients[1].id;
      fetchedPatients[1].family = clone(doeFamily);
      fetchedPatients[1].familyId = doeFamily.id;

      const { errors, success } = groupPatientsByChannelPoc({
        patients: [
          clone(fetchedPatients[0].get({ plain: true })),
          clone(fetchedPatients[1].get({ plain: true })),
        ],
        fetchedPatients,
        channel: 'sms',
      });
      expect(errors.length).toBe(1);
      expect(errors[0].patient.firstName).toBe('John');
      expect(errors[0].errorCode).toBe('3100');
      expect(success.length).toBe(1);
      expect(success[0].patient.firstName).toBe('Jack');
      expect(success[0].dependants.length).toBe(0);
    });

    test('should return John Doe with the failure/warning status code', () => {
      //  John Doe is in the array. Return John Doe with the failure/warning status code

      const fetchedPatients = [
        new Patient({
          firstNamed: 'Jack',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(3, 1),
        }),
        new Patient({
          firstName: 'John',
          mobilePhoneNumber: '+12223334444',
          pmsCreatedAt: date(1, 1),
        }),
      ];

      const blackFamily = new Family({ pmsCreatedAt: date(3, 1) });
      const doeFamily = new Family({ pmsCreatedAt: date(1, 1) });

      blackFamily.headId = fetchedPatients[0].id;
      fetchedPatients[0].family = clone(blackFamily);
      fetchedPatients[0].familyId = blackFamily.id;

      doeFamily.headId = fetchedPatients[1].id;
      fetchedPatients[1].family = clone(doeFamily);
      fetchedPatients[1].familyId = doeFamily.id;

      const { errors, success } = groupPatientsByChannelPoc({
        patients: [clone(fetchedPatients[1].get({ plain: true }))],
        fetchedPatients,
        channel: 'sms',
      });

      expect(errors.length).toBe(1);
      expect(errors[0].patient.firstName).toBe('John');
      expect(errors[0].errorCode).toBe('3100');
      expect(success.length).toBe(0);
    });

    // TODO: add functions to test edge cases of: duplicate patients, patients not in families, etc.
  });
});
