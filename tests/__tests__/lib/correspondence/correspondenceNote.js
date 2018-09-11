
import {
  reminderSent,
  reminderConfirmed,
  recallSent,
} from '../../../../server/lib/correspondences/correspondenceNote';


const buildSentReminderData = data => ({
  interval: '2 hours',
  primaryType: 'sms',
  isConfirmable: true,
  contactedPatientId: 'Mom',
  isFamily: false,
  patient: {
    firstName: 'Mom',
    lastName: 'Test',
  },
  reminder: { isCustomConfirm: false },
  ...data,
});

const momPatient = { id: 'Mom' };
const sonPatient = {
  id: 'Son',
  firstName: 'Son',
  lastName: 'Test',
};

describe('Correspondence Note Generators', () => {
  describe('#reminderSent', () => {
    test('should work for a 2 hours sms that requires confirmation', () => {
      expect(reminderSent(buildSentReminderData({
        interval: '2 hours',
        primaryType: 'sms',
        isConfirmable: true,
      }), momPatient)).toBe('Sent "2 Hours SMS Unconfirmed" Reminder for Appointment via CareCru');
    });

    test('should work for a 2 hours sms that does not require confirmation', () => {
      expect(reminderSent(buildSentReminderData({
        interval: '2 hours',
        primaryType: 'sms',
        isConfirmable: false,
      }), momPatient)).toBe('Sent "2 Hours SMS Confirmed" Reminder for Appointment via CareCru');
    });

    describe('#family reminders - self', () => {
      test('should work for a 2 hours sms that requires confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '2 hours',
          primaryType: 'sms',
          isConfirmable: true,
          isFamily: true,
        }), momPatient)).toBe('Sent "2 Hours SMS Unconfirmed" Family Reminder for Appointment via CareCru');
      });
        
      test('should work for a 2 hours sms that does not require confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '2 hours',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
        }), momPatient)).toBe('Sent "2 Hours SMS Confirmed" Family Reminder for Appointment via CareCru');
      });
    });
      
    describe('#family reminders - other', () => {
      test('should work for a 2 hours sms that requires confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '2 hours',
          primaryType: 'sms',
          isConfirmable: true,
          isFamily: true,
        }), sonPatient)).toBe('Sent "2 Hours SMS Unconfirmed" Family Reminder to Mom Test for Appointment via CareCru');
      });
        
      test('should work for a 2 hours sms that does not require confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '2 hours',
          primaryType: 'email',
          isConfirmable: false,
          isFamily: true,
        }), sonPatient)).toBe('Sent "2 Hours Email Confirmed" Family Reminder to Mom Test for Appointment via CareCru');
      });
    });
  });

  describe('#reminderSent - isCustomConfirm', () => {
    test('should work for a 14 days sms that requires pre-confirmation', () => {
      expect(reminderSent(buildSentReminderData({
        interval: '14 days',
        primaryType: 'sms',
        isConfirmable: true,
        reminder: { isCustomConfirm: true },
      }), momPatient))
        .toBe('Sent "14 Days SMS Unpreconfirmed" Reminder for Appointment via CareCru');
    });
  
    test('should work for a 14 days sms that requires pre-confirmation', () => {
      expect(reminderSent(buildSentReminderData({
        interval: '14 days',
        primaryType: 'sms',
        isConfirmable: false,
        reminder: { isCustomConfirm: true },
      }), momPatient)).toBe('Sent "14 Days SMS Pre-Confirmed" Reminder for Appointment via CareCru');
    });

    
    describe('#family reminders - self', () => {
      test('should work for a 14 days sms that requires pre-confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '14 days',
          primaryType: 'sms',
          isConfirmable: true,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), momPatient))
          .toBe('Sent "14 Days SMS Unpreconfirmed" Family Reminder for Appointment via CareCru');
      });
      
      test('should work for a 14 days sms that requires pre-confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '14 days',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), momPatient)).toBe('Sent "14 Days SMS Pre-Confirmed" Family Reminder for Appointment via CareCru');
      });
    });
        
    describe('#family reminders - other', () => {
      test('should work for a 14 days sms that requires pre-confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '14 days',
          primaryType: 'sms',
          isConfirmable: true,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), sonPatient))
          .toBe('Sent "14 Days SMS Unpreconfirmed" Family Reminder to Mom Test for Appointment via CareCru');
      });
      
      test('should work for a 14 days sms that requires pre-confirmation', () => {
        expect(reminderSent(buildSentReminderData({
          interval: '14 days',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), sonPatient)).toBe('Sent "14 Days SMS Pre-Confirmed" Family Reminder to Mom Test for Appointment via CareCru');
      });
    });
  });

  
  describe('#reminderConfirmed', () => {
    test('should work for a confirmed 2 hours sms', () => {
      expect(reminderConfirmed(buildSentReminderData({
        interval: '2 hours',
        primaryType: 'sms',
        isConfirmable: false,
        reminder: { isCustomConfirm: false },
      }), momPatient)).toBe('Mom Test Confirmed "2 Hours SMS" Reminder for Appointment via CareCru');
    });

    test('should work for a confirmed 2 days email', () => {
      expect(reminderConfirmed(buildSentReminderData({
        interval: '2 days',
        primaryType: 'email',
        isConfirmable: false,
        reminder: { isCustomConfirm: false },
      }), momPatient)).toBe('Mom Test Confirmed "2 Days Email" Reminder for Appointment via CareCru');
    });

    describe('#family reminders - self', () => {
      test('should work for a confirmed 2 hours sms', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '2 hours',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: false },
        }), momPatient)).toBe('Mom Test Confirmed "2 Hours SMS" Family Reminder for Appointment via CareCru');
      });
  
      test('should work for a confirmed 2 days email', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '2 days',
          primaryType: 'email',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: false },
        }), momPatient)).toBe('Mom Test Confirmed "2 Days Email" Family Reminder for Appointment via CareCru');
      });
    });

    describe('#family reminders - other', () => {
      test('should work for a confirmed 2 hours sms', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '2 hours',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: false },
        }), sonPatient)).toBe('Mom Test Confirmed "2 Hours SMS" Family Reminder for Son Test\'s Appointment via CareCru');
      });
  
      test('should work for a confirmed 2 days email', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '2 days',
          primaryType: 'email',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: false },
        }), sonPatient)).toBe('Mom Test Confirmed "2 Days Email" Family Reminder for Son Test\'s Appointment via CareCru');
      });
    });
  });

  describe('#reminderConfirmed - isCustomConfirm', () => {
    test('should work for a pre-confirmed 14 days sms', () => {
      expect(reminderConfirmed(buildSentReminderData({
        interval: '14 days',
        primaryType: 'sms',
        isConfirmable: false,
        reminder: { isCustomConfirm: true },
      }), momPatient)).toBe('Mom Test Pre-Confirmed "14 Days SMS" Reminder for Appointment via CareCru');
    });

    test('should work for a pre-confirmed 4 weeks email', () => {
      expect(reminderConfirmed(buildSentReminderData({
        interval: '4 weeks',
        primaryType: 'email',
        isConfirmable: false,
        reminder: { isCustomConfirm: true },
      }), momPatient)).toBe('Mom Test Pre-Confirmed "4 Weeks Email" Reminder for Appointment via CareCru');
    });

    describe('#family reminders - self', () => {
      test('should work for a pre-confirmed 14 days sms', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '14 days',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), momPatient)).toBe('Mom Test Pre-Confirmed "14 Days SMS" Family Reminder for Appointment via CareCru');
      });
  
      test('should work for a pre-confirmed 4 weeks email', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '4 weeks',
          primaryType: 'email',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), momPatient)).toBe('Mom Test Pre-Confirmed "4 Weeks Email" Family Reminder for Appointment via CareCru');
      });
    });

    describe('#family reminders - other', () => {
      test('should work for a pre-confirmed 14 days sms', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '14 days',
          primaryType: 'sms',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), sonPatient)).toBe('Mom Test Pre-Confirmed "14 Days SMS" Family Reminder for Son Test\'s Appointment via CareCru');
      });
  
      test('should work for a pre-confirmed 4 weeks email', () => {
        expect(reminderConfirmed(buildSentReminderData({
          interval: '4 weeks',
          primaryType: 'email',
          isConfirmable: false,
          isFamily: true,
          reminder: { isCustomConfirm: true },
        }), sonPatient)).toBe('Mom Test Pre-Confirmed "4 Weeks Email" Family Reminder for Son Test\'s Appointment via CareCru');
      });
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
