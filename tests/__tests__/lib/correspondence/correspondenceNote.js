
import {
  reminderSent,
  reminderConfirmed,
  recallSent,
} from '../../../../server/lib/correspondences/correspondenceNote';


describe('Correspondence Note Generators', () => {
  describe('#reminderSent', () => {
    test('should work for a 2 hours sms that requires confirmation', () => {
      expect(reminderSent({
        primaryType: 'sms',
        interval: '2 hours',
        isConfirmable: true,
      })).toBe('Sent "2 Hours SMS Unconfirmed" Reminder for Appointment via CareCru');
    });

    test('should work for a 2 hours sms that requires confirmation', () => {
      expect(reminderSent({
        primaryType: 'email',
        interval: '2 days',
        isConfirmable: false,
      })).toBe('Sent "2 Days Email Confirmed" Reminder for Appointment via CareCru');
    });
  });

  describe('#reminderConfirmed', () => {
    test('should work for a confirmed 2 hours sms', () => {
      expect(reminderConfirmed({
        primaryType: 'sms',
        interval: '2 hours',
      })).toBe('Patient Confirmed "2 Hours SMS" Reminder for Appointment via CareCru');
    });

    test('should work for a confirmed 2 days email', () => {
      expect(reminderConfirmed({
        primaryType: 'email',
        interval: '2 days',
      })).toBe('Patient Confirmed "2 Days Email" Reminder for Appointment via CareCru');
    });
  });

  describe('#recallSent', () => {
    test('should work for a confirmed 2 hours sms', () => {
      expect(recallSent({
        primaryType: 'sms',
        interval: '-2 months',
      })).toBe('Sent "2 Months After Due Date" SMS Recall via CareCru');
    });

    test('should work for a confirmed 2 days email', () => {
      expect(recallSent({
        primaryType: 'email',
        interval: '1 months',
      })).toBe('Sent "1 Months Before Due Date" Email Recall via CareCru');
    });
  });
});
