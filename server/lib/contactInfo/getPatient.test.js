
import getPatientBasedOnFieldsProvided from './getPatient';
import getPatientFromEmail from './getPatientFromEmail';
import { getPatientFromCellPhoneNumber } from './getPatientFromCellPhoneNumber';

jest.mock('./getPatientFromEmail.js');
jest.mock('./getPatientFromCellPhoneNumber.js');

describe('Contact Info Service', () => {
  describe('#getPatientBasedOnFieldsProvided', () => {
    it('calls getPatientFromCellPhoneNumber when mobile number is provided', () => {
      getPatientBasedOnFieldsProvided('1111', { cellPhoneNumber: '+1111' });
      expect(getPatientFromCellPhoneNumber).toHaveBeenCalled();
    });

    it('calls getPatientFromEmail when email is provided', () => {
      getPatientBasedOnFieldsProvided('1111', { email: 'test@carecru.com' });
      expect(getPatientFromEmail).toHaveBeenCalled();
    });

    it('returns null when no data is sent', () => {
      const result = getPatientBasedOnFieldsProvided('1111');
      expect(result).toBeNull();
    });
  });
});
