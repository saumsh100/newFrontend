
import groupPatientsByChannelPoc from '../../../../server/lib/contactInfo/groupPatientsByChannelPoc';

const date = (m, d) => new Date(2018, m, d);
const clone = obj => Object.assign({}, obj);

describe('Contact Info Service', () => {
  describe('#groupPatientsByChannelPoc', () => {
    test('should be a function', () => {
      expect(typeof groupPatientsByChannelPoc).toBe('function');
    });

    test('should return the mom with the son in the otherPatient and Joe Black by himself', () => {
      // a mom and her 4 year old son and 6 year old daughter share a mobilePhoneNumber for sms channel but only mom and son are in the array and Joe Black. Return the mom with the son in the otherPatient an Joe Black
      const jonesFamily = { id: 'Jones', pmsCreatedAt: date(1, 1), headId: 'Mom' };
      const fetchedPatients = [
        { id: 'Mom', mobilePhoneNumber: '111', familyId: 'Jones', pmsCreatedAt: date(1, 1), family: clone(jonesFamily) },
        { id: 'Son', mobilePhoneNumber: '111', familyId: 'Jones', pmsCreatedAt: date(1, 1), family: clone(jonesFamily) },
        { id: 'Daughter', mobilePhoneNumber: '111', familyId: 'Jones', pmsCreatedAt: date(1, 1), family: clone(jonesFamily) },
      ];

      const { errors, success } = groupPatientsByChannelPoc({ patients: [clone(fetchedPatients[0]), clone(fetchedPatients[1])], fetchedPatients, channel: 'sms' });
      expect(errors.length).toBe(0);
      expect(success.length).toBe(1);
      expect(success[0].patient.id).toBe('Mom');
      expect(success[0].dependants.length).toBe(1);
      expect(success[0].dependants[0].id).toBe('Son');
    });

    test('should return the mom with the son, and the otherPatient also', () => {
      // just the son now is in the array. Return the mom with the son in the otherPatient
      const jonesFamily = { id: 'Jones', pmsCreatedAt: date(1, 1), headId: 'Mom' };
      const blackFamily = { id: 'Black', pmsCreatedAt: date(1, 2), headId: 'Jack' };
      const fetchedPatients = [
        { id: 'Mom', mobilePhoneNumber: '111', familyId: 'Jones', pmsCreatedAt: date(1, 1), family: clone(jonesFamily) },
        { id: 'Son', mobilePhoneNumber: '111', familyId: 'Jones', pmsCreatedAt: date(1, 1), family: clone(jonesFamily) },
        { id: 'Daughter', mobilePhoneNumber: '111', familyId: 'Jones', pmsCreatedAt: date(1, 1), family: clone(jonesFamily) },
        { id: 'Jack', mobilePhoneNumber: '222', familyId: 'Black', pmsCreatedAt: date(1, 2), family: clone(blackFamily) },
      ];

      const { errors, success } = groupPatientsByChannelPoc({ patients: [clone(fetchedPatients[1]), clone(fetchedPatients[3])], fetchedPatients, channel: 'sms' });
      expect(errors.length).toBe(0);
      expect(success.length).toBe(2);
      expect(success[0].patient.id).toBe('Mom');
      expect(success[0].dependants.length).toBe(1);
      expect(success[0].dependants[0].id).toBe('Son');
      expect(success[1].patient.id).toBe('Jack');
      expect(success[1].dependants.length).toBe(0);
    });

    test('should return them all separate with no groupings', () => {
      // a dad and his 2 daughters 18 and 20 year old all have separate emails. Return them all separate with no groupings
      const jamesFamily = { id: 'James', pmsCreatedAt: date(1, 1), headId: 'Dad' };
      const fetchedPatients = [
        { id: 'Dad', mobilePhoneNumber: '333', familyId: 'James', pmsCreatedAt: date(1, 1), family: clone(jamesFamily) },
        { id: 'Daughter1', mobilePhoneNumber: '444', familyId: 'James', pmsCreatedAt: date(1, 1), family: clone(jamesFamily) },
        { id: 'Daughter2', mobilePhoneNumber: '555', familyId: 'James', pmsCreatedAt: date(1, 1), family: clone(jamesFamily) },
      ];

      const { errors, success } = groupPatientsByChannelPoc({ patients: [clone(fetchedPatients[0]), clone(fetchedPatients[1]), clone(fetchedPatients[2])], fetchedPatients, channel: 'sms' });
      expect(errors.length).toBe(0);
      expect(success.length).toBe(3);
      expect(success[0].patient.id).toBe('Dad');
      expect(success[0].dependants.length).toBe(0);
      expect(success[1].patient.id).toBe('Daughter1');
      expect(success[1].dependants.length).toBe(0);
      expect(success[2].patient.id).toBe('Daughter2');
      expect(success[2].dependants.length).toBe(0);
    });

    test('should return Joe Black as he and his family are newer but also an error because of John Doe not being PoC', () => {
      // a dad and his 2 daughters 18 and 20 year old all have separate emails. Return them all separate with no groupings
      const blackFamily = { id: 'Black', pmsCreatedAt: date(3, 1), headId: 'Jack' };
      const doeFamily = { id: 'Doe', pmsCreatedAt: date(1, 1), headId: 'John' };
      const fetchedPatients = [
        { id: 'Jack', mobilePhoneNumber: '333', familyId: 'Black', pmsCreatedAt: date(3, 1), family: clone(blackFamily) },
        { id: 'John', mobilePhoneNumber: '333', familyId: 'Doe', pmsCreatedAt: date(1, 1), family: clone(doeFamily) },
      ];

      const { errors, success } = groupPatientsByChannelPoc({ patients: [clone(fetchedPatients[0]), clone(fetchedPatients[1])], fetchedPatients, channel: 'sms' });
      expect(errors.length).toBe(1);
      expect(errors[0].patient.id).toBe('John');
      expect(errors[0].errorCode).toBe('3100');
      expect(success.length).toBe(1);
      expect(success[0].patient.id).toBe('Jack');
      expect(success[0].dependants.length).toBe(0);
    });

    test('should return John Doe with the failure/warning status code', () => {
      //  John Doe is in the array. Return John Doe with the failure/warning status code
      const blackFamily = { id: 'Black', pmsCreatedAt: date(3, 1), headId: 'Jack' };
      const doeFamily = { id: 'Doe', pmsCreatedAt: date(1, 1), headId: 'John' };
      const fetchedPatients = [
        { id: 'Jack', mobilePhoneNumber: '333', familyId: 'Black', pmsCreatedAt: date(3, 1), family: clone(blackFamily) },
        { id: 'John', mobilePhoneNumber: '333', familyId: 'Doe', pmsCreatedAt: date(1, 1), family: clone(doeFamily) },
      ];

      const { errors, success } = groupPatientsByChannelPoc({ patients: [clone(fetchedPatients[1])], fetchedPatients, channel: 'sms' });

      //console.log('errors', errors);
      //console.log('success', success);

      expect(errors.length).toBe(1);
      expect(errors[0].patient.id).toBe('John');
      expect(errors[0].errorCode).toBe('3100');
      expect(success.length).toBe(0);
    });

    // TODO: add functions to test edge cases of: duplicate patients, patients not in families, etc.
  });
});
