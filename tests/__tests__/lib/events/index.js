
import { v4 as uuid } from 'uuid';
import {
  Appointment,
  Reminder,
  SentReminder,
  SentRemindersPatients,
  SentReview,
  Review,
  Patient,
  Request,
  PatientUser,
  Recall,
  SentRecall,
} from 'CareCruModels';
import patientEventsAggregator from '../../../../server/lib/events';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { seedTestChairs, chairId } from '../../../util/seedTestChairs';
import { serviceId, seedTestService } from '../../../util/seedTestServices';
import { wipeAllModels } from '../../../util/wipeModel';

const appointmentId = uuid();

const limit = 5;
const eventsOffsetLimitObj = JSON.stringify({
  reminder: {
    offset: 0,
    limit,
  },
  review: {
    offset: 0,
    limit,
  },
  appointment: {
    offset: 0,
    limit,
  },
  call: {
    offset: 0,
    limit,
  },
  recall: {
    offset: 0,
    limit,
  },
  reviews: {
    offset: 0,
    limit,
  },
});

const makeApptData = (data = {}) => ({
  accountId,
  patientId,
  practitionerId,
  chairId,
  ...data,
});

const makeSentReviewData = (data = {}) => ({
  patientId,
  appointmentId,
  accountId,
  ...data,
});

const makeReviewData = (data = {}) => ({
  patientId,
  accountId,
  stars: 3,
  ...data,
});

const makeSentReminderData = (data = {}) => ({
  contactedPatientId: patientId,
  accountId,
  interval: '1 days',
  primaryType: 'sms',
  ...data,
});

const makeSentRecallData = (data = {}) => ({
  // Doesnt even have to match recall for this test
  patientId,
  accountId,
  lengthSeconds: 15552000,
  createdAt: date(2000, 10, 10, 9),
  isSent: true,
  ...data,
});

const date = (y, m, d, h) => new Date(y, m, d, h).toISOString();
const dates = (y, m, d, h) => ({
  startDate: date(y, m, d, h),
  endDate: date(y, m, d, h + 1),
});

describe('Fetching a single patients events', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestChairs();
    await seedTestService();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#patientEventsAggregator', () => {
    test('should be a function', () => {
      expect(typeof patientEventsAggregator).toBe('function');
    });

    test('should retrieve a single new patient event', async () => {
      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        eventsOffsetLimitObj,
      });
      expect(events.length).toBe(1);
    });

    test('should retrieve all appointment events for this patient', async () => {
      await Appointment.bulkCreate([
        makeApptData({ ...dates(2014, 7, 5, 8) }),
        makeApptData({ ...dates(2015, 7, 5, 8) }),
        makeApptData({ ...dates(2016, 7, 5, 8) }),
      ]);

      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        retrieveEventTypes: ['appointment'],
        eventsOffsetLimitObj: JSON.stringify({
          appointment: {
            limit,
            offset: 0,
          },
        }),
      });
      expect(events.length).toBe(3);
    });

    test('should retrieve 1 reminder event', async () => {
      const reminder1 = await Reminder.create({
        accountId,
        primaryTypes: ['sms'],
        interval: '1086410 seconds',
      });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const sentReminder1 = await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        interval: '1086410 seconds',
        isSent: true,
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder1.id,
        patientId,
        appointmentId: appts[0].id,
      });

      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        retrieveEventTypes: ['reminder'],
        eventsOffsetLimitObj: JSON.stringify({
          reminder: {
            limit,
            offset: 0,
          },
        }),
      });

      expect(events.length).toBe(1);
      expect(events[0].metaData.primaryType).toMatchSnapshot();
    });

    test('should retrieve 1 review event', async () => {
      const olderAppt = await Appointment.create(makeApptData({
        patientId,
        ...dates(2017, 7, 5, 12),
      }));

      const rev = await Review.bulkCreate([makeReviewData({ patientId })]);

      await SentReview.bulkCreate([
        makeSentReviewData({
          isSent: true,
          isCompleted: true,
          appointmentId: olderAppt.id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280a',
          reviewId: rev[0].id,
        }),
      ]);

      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        retrieveEventTypes: ['review'],
        eventsOffsetLimitObj: JSON.stringify({
          review: {
            limit,
            offset: 0,
          },
        }),
      });

      expect(events.length).toBe(1);
      expect(events[0].metaData.stars).toMatchSnapshot();
    });

    test('should retrieve 1 online request event', async () => {
      const patientUser = await PatientUser.create({
        email: 'test@test.com',
        password: 'thisisus',
        firstName: 'Old',
        lastName: 'Patient',
        phoneNumber: '555-555-5555',
      });
      const patientUserPlain = patientUser.get({ plain: true });

      await Request.bulkCreate([
        {
          accountId,
          serviceId,
          patientUserId: patientUserPlain.id,
          startDate: date(2014, 7, 7, 6),
          endDate: date(2014, 7, 7, 7),
          isConfirmed: true,
        },
      ]);

      await Patient.update(
        { patientUserId: patientUserPlain.id },
        { where: { id: patientId } },
      );
      const events = await patientEventsAggregator(patientId, accountId, {
        retrieveEventTypes: ['request'],
        eventsOffsetLimitObj: JSON.stringify({
          request: {
            limit,
            offset: 0,
          },
        }),
        limit,
      });
      expect(events.length).toBe(1);
    });

    test('should retrieve 1 recall event', async () => {
      const recall = await Recall.create({
        accountId,
        primaryType: 'email',
        lengthSeconds: 15552000,
        interval: '1 Month Before',
      });

      const recallPlain = recall.get({ plain: true });

      await SentRecall.create(makeSentRecallData({
        recallId: recallPlain.id,
        primaryType: 'email',
      }));

      const events = await patientEventsAggregator(patientId, accountId, {
        retrieveEventTypes: ['recall'],
        eventsOffsetLimitObj: JSON.stringify({
          recall: {
            limit,
            offset: 0,
          },
        }),
        limit,
      });

      expect(events.length).toBe(1);
    });

    test('should retrieve all events for this patient', async () => {
      const reminder1 = await Reminder.create({
        accountId,
        primaryTypes: ['sms'],
        interval: '1086410 seconds',
      });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const sentReminder1 = await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        interval: '1086410 seconds',
        isSent: true,
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder1.id,
        patientId,
        appointmentId: appts[0].id,
      });

      const olderAppt = await Appointment.create(makeApptData({
        patientId,
        ...dates(2017, 7, 5, 12),
      }));

      const rev = await Review.bulkCreate([makeReviewData({ patientId })]);

      await SentReview.bulkCreate([
        makeSentReviewData({
          isSent: true,
          appointmentId: olderAppt.id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          reviewId: rev[0].id,
        }),
      ]);

      const events = await patientEventsAggregator(patientId, accountId, {
        eventsOffsetLimitObj,
        limit,
      });
      expect(events.length).toBe(5);
    });

    test('should offset and retrieve older appointments', async () => {
      await Appointment.bulkCreate([
        makeApptData({ ...dates(2014, 7, 5, 8) }),
        makeApptData({ ...dates(2015, 7, 5, 8) }),
        makeApptData({ ...dates(2016, 7, 5, 8) }),
        makeApptData({ ...dates(2017, 7, 5, 8) }),
        makeApptData({ ...dates(2018, 7, 5, 8) }),
        makeApptData({ ...dates(2019, 7, 5, 8) }),
      ]);

      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        retrieveEventTypes: ['appointment'],
        eventsOffsetLimitObj: JSON.stringify({
          appointment: {
            offset: 4,
            limit,
          },
        }),
      });
      expect(events.length).toBe(2);
    });

    test('No events, including when patient was created', async () => {
      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        offset: 4,
        excludeEventTypes: ['newPatient'],
        eventsOffsetLimitObj,
      });
      expect(events.length).toBe(0);
    });
  });

  describe('#Review Grouping Function', () => {
    test('should retrieve 1 grouped review event', async () => {
      const olderAppt = await Appointment.create(makeApptData({
        patientId,
        ...dates(2017, 7, 5, 12),
      }));

      const rev = await Review.bulkCreate([makeReviewData({ patientId })]);

      await SentReview.bulkCreate([
        makeSentReviewData({
          isSent: true,
          isCompleted: true,
          appointmentId: olderAppt.id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280a',
          reviewId: rev[0].id,
        }),
        makeSentReviewData({
          isSent: true,
          isCompleted: false,
          appointmentId: olderAppt.id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280b',
          reviewId: null,
        }),
      ]);

      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        retrieveEventTypes: ['review'],
        eventsOffsetLimitObj: JSON.stringify({
          review: {
            limit,
            offset: 0,
          },
        }),
      });

      expect(events.length).toBe(1);
    });

    test('should retrieve 2 grouped review events and 1 not grouped review event', async () => {
      const apps = await Appointment.bulkCreate([
        makeApptData({ ...dates(2014, 7, 5, 8) }),
        makeApptData({ ...dates(2015, 7, 5, 8) }),
        makeApptData({ ...dates(2016, 7, 5, 8) }),
      ]);


      const rev = await Review.bulkCreate([makeReviewData({ patientId })]);

      await SentReview.bulkCreate([
        makeSentReviewData({
          isSent: true,
          isCompleted: true,
          appointmentId: apps[0].id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280a',
          reviewId: rev[0].id,
        }),
        makeSentReviewData({
          isSent: true,
          isCompleted: false,
          appointmentId: apps[0].id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280b',
          reviewId: null,
        }),
        makeSentReviewData({
          isSent: true,
          isCompleted: false,
          appointmentId: apps[1].id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280c',
          reviewId: rev[0].id,
        }),
        makeSentReviewData({
          isSent: true,
          isCompleted: false,
          appointmentId: apps[1].id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280d',
          reviewId: null,
        }),
        makeSentReviewData({
          isSent: true,
          isCompleted: true,
          appointmentId: apps[2].id,
          patientId,
          createdAt: date(2017, 7, 5, 16),
          id: '230804b2-d600-464c-bc86-5bc88804280e',
          reviewId: null,
        }),
      ]);

      const events = await patientEventsAggregator(patientId, accountId, {
        limit,
        retrieveEventTypes: ['review'],
        eventsOffsetLimitObj: JSON.stringify({
          review: {
            limit,
            offset: 0,
          },
        }),
      });

      expect(events.length).toBe(3);
    });
  });
});

