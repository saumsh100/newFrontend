
import { v4 as uuid } from 'uuid';
import moment from 'moment-timezone';
import toArray from 'lodash/toArray';
import {
  computeOpeningsForPractitioner,
} from '../../../../server/lib/availabilities/computeOpeningsAndAvailabilities';

const generateWeeklySchedule = data => Object.assign(
  {},
  {
    monday: { isClosed: true },
    tuesday: { isClosed: true },
    wednesday: { isClosed: true },
    thursday: { isClosed: true },
    friday: { isClosed: true },
    saturday: { isClosed: true },
    sunday: { isClosed: true },
  },
  data,
);

const TZ = 'America/Edmonton';
const iso = (time, day = '03-08') => moment.tz(`2018-${day} ${time}:00`, TZ).toISOString();
const d = (time, day = '03-08') => new Date(iso(time, day));

const DEFAULT_OFFICE_HOURS = generateWeeklySchedule({
  monday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
  tuesday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
  wednesday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
  thursday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
  friday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
  saturday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
  sunday: { isClosed: false, startTime: iso('01:00'), endTime: iso('23:00') },
});

const DEFAULT_ACCOUNT = {
  timezone: TZ,
  timeInterval: 60,
  weeklySchedule: DEFAULT_OFFICE_HOURS,
  dailySchedules: [],
};

const DEFAULT_SERVICE = {
  duration: 30,
};

// generateAppointmentData, meant to be simple variable name to save space
const a = (data = {}) => ({
  id: uuid(),
  ...data,
});

describe('Availabilities Library', () => {
  let account;
  let service;
  beforeEach(() => {
    account = DEFAULT_ACCOUNT;
    service = DEFAULT_SERVICE;
  });

  describe('#computeOpeningsForPractitioner', () => {
    test('should be a function', () => {
      expect(typeof computeOpeningsForPractitioner).toBe('function');
    });

    test('should return 3 finalDailySchedules with no openings cause the weeklySchedule is closed', () => {
      const ms = moment.tz('2018-03-08 08:00:00', TZ);
      const me = ms.clone().add(2, 'days');
      const weeklySchedule = generateWeeklySchedule({});

      const data = computeOpeningsForPractitioner({
        account,
        service,
        weeklySchedule,
        timeOffs: [],
        dailySchedules: [],
        appointments: [],
        startDate: ms.toISOString(),
        endDate: me.toISOString(),
      });

      expect(toArray(data).length).toBe(3);
      expect(data['2018-03-08'].openings.length).toBe(0);
      expect(data['2018-03-09'].openings.length).toBe(0);
      expect(data['2018-03-10'].openings.length).toBe(0);
    });

    test('should return 1 finalDailySchedules with no openings cause the weeklySchedule is closed', () => {
      const startDate = iso('06:00'); // Thursday
      const endDate = iso('18:00');
      const weeklySchedule = generateWeeklySchedule({
        thursday: {
          startTime: iso('08:00'),
          endTime: iso('17:00'),
          breaks: [
            {
              startTime: iso('12:00'),
              endTime: iso('13:00'),
            },
          ],
        },
      });

      const appointments = [
        a({
          startDate: iso('08:00'),
          endDate: iso('11:30'),
        }),
        a({
          startDate: iso('13:00'),
          endDate: iso('14:00'),
        }),
      ];

      const data = computeOpeningsForPractitioner({
        account,
        service,
        weeklySchedule,
        timeOffs: [],
        dailySchedules: [],
        appointments,
        startDate,
        endDate,
      });

      expect(toArray(data).length).toBe(1);
      expect(data['2018-03-08'].openings).toEqual([
        {
          startDate: d('11:30'),
          endDate: d('12:00'),
        },
        {
          startDate: d('14:00'),
          endDate: d('17:00'),
        },
      ]);
    });

    describe('Integration Tests - General Scenario Across 4 Days', () => {
      let dailySchedules;
      let timeOffs;
      let weeklySchedule;
      let appointments;
      beforeEach(() => {
        dailySchedules = [];
        timeOffs = [];
        weeklySchedule = generateWeeklySchedule({
          monday: {
            isClosed: false,
            startTime: iso('08:00'),
            endTime: iso('17:00'),
            breaks: [
              {
                startTime: iso('12:00'),
                endTime: iso('13:00'),
              },
            ],
          },

          tuesday: {
            isClosed: false,
            startTime: iso('08:00'),
            endTime: iso('17:00'),
            breaks: [
              {
                startTime: iso('12:00'),
                endTime: iso('13:00'),
              },
            ],
          },

          wednesday: {
            isClosed: false,
            startTime: iso('13:00'),
            endTime: iso('20:00'),
          },
        });

        appointments = [
          a({
            startDate: iso('08:45', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          }),
          a({
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          }),
          a({
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:30', '03-05'), // Monday
          }),
          a({
            startDate: iso('07:30', '03-06'), // Tuesday
            endDate: iso('10:00', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('10:00', '03-06'), // Tuesday
            endDate: iso('12:30', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('12:30', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('18:30', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('14:00', '03-07'), // Wednesday
            endDate: iso('15:00', '03-07'), // Wednesday
          }),
          a({
            startDate: iso('16:00', '03-07'), // Wednesday
            endDate: iso('16:30', '03-07'), // Wednesday
          }),
          a({
            startDate: iso('17:00', '03-07'), // Wednesday
            endDate: iso('18:00', '03-07'), // Wednesday
          }),
          a({
            startDate: iso('18:00', '03-07'), // Wednesday
            endDate: iso('19:00', '03-07'), // Wednesday
          }),
        ];
      });

      test('should return 4 days with the correct openings', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday afternoon

        const data = computeOpeningsForPractitioner({
          account,
          service,
          weeklySchedule,
          timeOffs,
          dailySchedules,
          appointments,
          startDate,
          endDate,
        });

        expect(toArray(data).length).toBe(4);

        const monday = data['2018-03-05'];
        const tuesday = data['2018-03-06'];
        const wednesday = data['2018-03-07'];
        const thursday = data['2018-03-08'];

        // Check fillers
        expect(monday.fillers.length).toBe(4);
        expect(monday.fillers[3].type).toBe('Break');
        expect(tuesday.fillers.length).toBe(5);
        expect(tuesday.fillers[2].type).toBe('Break');
        expect(wednesday.fillers.length).toBe(4);
        expect(thursday.fillers.length).toBe(0);

        // Check openings
        expect(monday.openings).toEqual([
          { startDate: d('08:00', '03-05'), endDate: d('08:45', '03-05') },
          { startDate: d('11:30', '03-05'), endDate: d('12:00', '03-05') },
          { startDate: d('13:00', '03-05'), endDate: d('17:00', '03-05') },
        ]);
        expect(tuesday.openings).toEqual([]);
        expect(wednesday.openings).toEqual([
          { startDate: d('13:00', '03-07'), endDate: d('14:00', '03-07') },
          { startDate: d('15:00', '03-07'), endDate: d('16:00', '03-07') },
          { startDate: d('16:30', '03-07'), endDate: d('17:00', '03-07') },
          { startDate: d('19:00', '03-07'), endDate: d('20:00', '03-07') },
        ]);
        expect(thursday.openings).toEqual([]);

        // Check DailySchedule
        expect(monday.dailySchedule.isClosed).toBe(false);
        expect(monday.dailySchedule.isDailySchedule).toBe(false);
        expect(tuesday.dailySchedule.isClosed).toBe(false);
        expect(tuesday.dailySchedule.isDailySchedule).toBe(false);
        expect(wednesday.dailySchedule.isClosed).toBe(false);
        expect(wednesday.dailySchedule.isDailySchedule).toBe(false);
        expect(thursday.dailySchedule.isClosed).toBe(true);
        expect(thursday.dailySchedule.isDailySchedule).toBe(false);
      });

      test('should return 4 days with the correct openings with dailySchedules overriding', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday afternoon

        dailySchedules = dailySchedules.concat([
          {
            date: '2018-03-05',
            startTime: iso('08:00'),
            endTime: iso('13:00'),
          },
          {
            date: '2018-03-06',
            startTime: iso('08:00'),
            endTime: iso('20:00'),
            breaks: [
              {
                startTime: iso('12:00'),
                endTime: iso('13:00'),
              },
            ],
          },
          {
            date: '2018-03-07',
            startTime: iso('08:00'),
            endTime: iso('08:00'),
          },
        ]);

        const data = computeOpeningsForPractitioner({
          account,
          service,
          weeklySchedule,
          timeOffs,
          dailySchedules,
          appointments,
          startDate,
          endDate,
        });

        expect(toArray(data).length).toBe(4);

        const monday = data['2018-03-05'];
        const tuesday = data['2018-03-06'];
        const wednesday = data['2018-03-07'];
        const thursday = data['2018-03-08'];

        // Check fillers
        expect(monday.fillers.length).toBe(3);
        expect(tuesday.fillers.length).toBe(5);
        expect(tuesday.fillers[2].type).toBe('Break');
        expect(wednesday.fillers.length).toBe(4);
        expect(thursday.fillers.length).toBe(0);

        // Check openings
        expect(monday.openings).toEqual([
          { startDate: d('08:00', '03-05'), endDate: d('08:45', '03-05') },
          { startDate: d('11:30', '03-05'), endDate: d('13:00', '03-05') }, // Break is removed and new endDate
        ]);
        expect(tuesday.openings).toEqual([
          { startDate: d('18:30', '03-06'), endDate: d('20:00', '03-06') },
        ]);
        expect(wednesday.openings).toEqual([]);
        expect(thursday.openings).toEqual([]);

        // Check DailySchedule
        expect(monday.dailySchedule.isClosed).toBe(false);
        expect(monday.dailySchedule.isDailySchedule).toBe(true);
        expect(tuesday.dailySchedule.isClosed).toBe(false);
        expect(tuesday.dailySchedule.isDailySchedule).toBe(true);
        expect(wednesday.dailySchedule.isClosed).toBe(false);
        expect(wednesday.dailySchedule.isDailySchedule).toBe(true);
        expect(thursday.dailySchedule.isClosed).toBe(true);
        expect(thursday.dailySchedule.isDailySchedule).toBe(false);
      });

      test('should return 4 days with the correct openings with timeOffs overriding', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday afternoon

        timeOffs = timeOffs.concat([
          {
            startDate: iso('12:00', '03-05'), // Monday 12:00am
            endDate: iso('19:00', '03-07'), // Wednesday 19:00pm
          },
        ]);

        const data = computeOpeningsForPractitioner({
          account,
          service,
          weeklySchedule,
          timeOffs,
          dailySchedules,
          appointments,
          startDate,
          endDate,
        });

        expect(toArray(data).length).toBe(4);

        const monday = data['2018-03-05'];
        const tuesday = data['2018-03-06'];
        const wednesday = data['2018-03-07'];
        const thursday = data['2018-03-08'];

        // Check fillers
        expect(monday.fillers.length).toBe(4);
        expect(tuesday.fillers.length).toBe(5);
        expect(tuesday.fillers[2].type).toBe('Break');
        expect(wednesday.fillers.length).toBe(4);
        expect(thursday.fillers.length).toBe(0);

        // Check openings
        expect(monday.openings).toEqual([
          { startDate: d('08:00', '03-05'), endDate: d('08:45', '03-05') },
          { startDate: d('11:30', '03-05'), endDate: d('12:00', '03-05') }, // Break is removed and new endDate
        ]);
        expect(tuesday.openings).toEqual([]);
        expect(wednesday.openings).toEqual([
          { startDate: d('19:00', '03-07'), endDate: d('20:00', '03-07') },
        ]);
        expect(thursday.openings).toEqual([]);

        // Check DailySchedule
        expect(monday.dailySchedule.isClosed).toBe(false);
        expect(monday.dailySchedule.isDailySchedule).toBe(false);
        expect(monday.dailySchedule.isModifiedByTimeOff).toBe(true);
        expect(tuesday.dailySchedule.isClosed).toBe(true);
        expect(tuesday.dailySchedule.isDailySchedule).toBe(false);
        expect(tuesday.dailySchedule.isModifiedByTimeOff).toBe(true);
        expect(wednesday.dailySchedule.isClosed).toBe(false);
        expect(wednesday.dailySchedule.isDailySchedule).toBe(false);
        expect(wednesday.dailySchedule.isModifiedByTimeOff).toBe(true);
        expect(thursday.dailySchedule.isClosed).toBe(true);
        expect(thursday.dailySchedule.isDailySchedule).toBe(false);
        expect(thursday.dailySchedule.isModifiedByTimeOff).toBe(false);
      });


      test('should return 4 days with the correct openings with officeHours properly overriding', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday afternoon
        account.weeklySchedule = generateWeeklySchedule({
          monday: {
            isClosed: true, // Testing blocking off
          },

          tuesday: {
            isClosed: false, // Testing the boundary change
            startTime: iso('09:00'),
            endTime: iso('19:00'),
          },

          wednesday: {
            isClosed: false,
            startTime: iso('13:00'),
            endTime: iso('20:00'),
          },
        });

        account.dailySchedules = [];

        dailySchedules = dailySchedules.concat([
          {
            date: '2018-03-05',
            startTime: iso('08:00'),
            endTime: iso('13:00'),
          },
          {
            date: '2018-03-06',
            startTime: iso('08:00'),
            endTime: iso('20:00'),
            breaks: [
              {
                startTime: iso('12:00'),
                endTime: iso('13:00'),
              },
            ],
          },
          {
            date: '2018-03-07',
            startTime: iso('08:00'),
            endTime: iso('08:00'),
          },
        ]);

        const data = computeOpeningsForPractitioner({
          account,
          service,
          weeklySchedule,
          timeOffs,
          dailySchedules,
          appointments,
          startDate,
          endDate,
        });

        expect(toArray(data).length).toBe(4);

        const monday = data['2018-03-05'];
        const tuesday = data['2018-03-06'];
        const wednesday = data['2018-03-07'];
        const thursday = data['2018-03-08'];

        // Check fillers
        expect(monday.fillers.length).toBe(3);
        expect(tuesday.fillers.length).toBe(5);
        expect(tuesday.fillers[2].type).toBe('Break');
        expect(wednesday.fillers.length).toBe(4);
        expect(thursday.fillers.length).toBe(0);

        // Check openings
        expect(monday.openings).toEqual([]);
        expect(tuesday.openings).toEqual([
          // OfficeHours boundary stops it going to 20:00
          { startDate: d('18:30', '03-06'), endDate: d('19:00', '03-06') },
        ]);
        expect(wednesday.openings).toEqual([]);
        expect(thursday.openings).toEqual([]);

        // Check DailySchedule
        expect(monday.dailySchedule.isClosed).toBe(true);
        expect(tuesday.dailySchedule.isClosed).toBe(false);
        expect(wednesday.dailySchedule.isClosed).toBe(false);
        expect(thursday.dailySchedule.isClosed).toBe(true);
      });
    });
  });
});
