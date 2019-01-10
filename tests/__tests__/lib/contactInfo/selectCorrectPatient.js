
import {
  lonePatient,
  scenario1,
  scenario2,
  scenario3,
  scenario4,
  scenario5,
  scenario6,
  scenario7,
  scenario8,
  scenario9,
} from '../../../util/contactInfoSeedingData';
import selectCorrectPatient from '../../../../server/lib/contactInfo/selectCorrectPatient';

describe('Contact Info Service', () => {
  describe('#selectCorrectPatient', () => {
    test('should be a function', () => {
      expect(typeof selectCorrectPatient).toBe('function');
    });

    test('empty array returns null', () => {
      expect(selectCorrectPatient([])).toBe(null);
    });

    test('single patient returns itself', () => {
      const poc = selectCorrectPatient(lonePatient());
      expect(poc.firstName).toBe('Forever Alone');
    });

    describe('scenarios', () => {
      test('1 - Dad, who is the oldest Active adult in the family, is the PoC', () => {
        const patients = scenario1();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Dad');
      });

      test('2 - Dad, who is Head of Family is the PoC', () => {
        const patients = scenario2();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Dad');
      });

      test('3 - Dad, who is the oldest Active adult in the family, is the PoC', () => {
        const patients = scenario3();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Dad');
      });

      test('4 - Mom, who is the only adult and head of family in the family, is the PoC', () => {
        const patients = scenario4();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Mom');
      });

      test('5 - Mom, who is the only adult in the family, is the PoC', () => {
        const patients = scenario5();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Mom');
      });

      test('6 - Grandma is the PoC because she is the Active Head of family', () => {
        const patients = scenario6();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Grandma');
      });

      test('7 - BigSis is the PoC because she is the oldest active adult', () => {
        const patients = scenario7();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('BigSis');
      });

      test('8 - Grandma is the PoC because she is the oldest active patient', () => {
        const patients = scenario8();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Grandma');
      });

      test('9 - Because there is no active patient the oldest inactive patient is the PoC', () => {
        const patients = scenario9();
        const poc = selectCorrectPatient(patients);

        expect(poc.firstName).toBe('Nephew');
      });
    });
  });
});
