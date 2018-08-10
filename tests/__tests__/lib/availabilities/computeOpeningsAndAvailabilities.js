
import moment from 'moment-timezone';
import toArray from 'lodash/toArray';
import computeOpeningsAndAvailabilities, {
  computeOpeningsForPractitioner,
} from '../../../../server/lib/availabilities/computeOpeningsAndAvailabilities';

const TZ = 'America/Edmonton';
const account = { timezone: TZ, timeInterval: 60 };
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

const iso = (time, day = '03-08') => moment.tz(`2018-${day} ${time}:00`, TZ).toISOString();
const d = (time, day = '03-08') => new Date(iso(time, day));

describe('Availabilities Library', () => {
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
        {
          startDate: iso('08:00'),
          endDate: iso('11:30'),
        },
        {
          startDate: iso('13:00'),
          endDate: iso('14:00'),
        },
      ];

      const data = computeOpeningsForPractitioner({
        account,
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

    describe('Integration Tests - General Scenario Accross 4 Days', () => {
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
          {
            startDate: iso('08:45', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          },
          {
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          },
          {
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:30', '03-05'), // Monday
          },
          {
            startDate: iso('07:30', '03-06'), // Tuesday
            endDate: iso('10:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('10:00', '03-06'), // Tuesday
            endDate: iso('12:30', '03-06'), // Tuesday
          },
          {
            startDate: iso('12:30', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('18:30', '03-06'), // Tuesday
          },
          {
            startDate: iso('14:00', '03-07'), // Wednesday
            endDate: iso('15:00', '03-07'), // Wednesday
          },
          {
            startDate: iso('16:00', '03-07'), // Wednesday
            endDate: iso('16:30', '03-07'), // Wednesday
          },
          {
            startDate: iso('17:00', '03-07'), // Wednesday
            endDate: iso('18:00', '03-07'), // Wednesday
          },
          {
            startDate: iso('18:00', '03-07'), // Wednesday
            endDate: iso('19:00', '03-07'), // Wednesday
          },
        ];
      });

      test('should return 4 days with the correct openings', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday afternoon

        const data = computeOpeningsForPractitioner({
          account,
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
    });


  });

  describe('#computeOpeningsAndAvailabilities', () => {
    describe('Integration Tests - General Scenario Accross 4 Days with 2 Practitioners', () => {
      let weeklySchedule;
      let officeHours;
      let appts1;
      let appts2;
      let service;
      beforeEach(() => {
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
            endTime: iso('21:00'),
          },
        });
        service = { duration: 120  };

        officeHours = generateWeeklySchedule({
          monday: {
            isClosed: false,
            startTime: iso('09:00'),
            endTime: iso('18:00'),
          },

          tuesday: {
            isClosed: false,
            startTime: iso('09:00'),
            endTime: iso('18:00'),
          },
        });

        appts1 = [
          {
            startDate: iso('08:45', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          },
          {
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          },
          {
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:30', '03-05'), // Monday
          },
          {
            startDate: iso('07:30', '03-06'), // Tuesday
            endDate: iso('10:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('10:00', '03-06'), // Tuesday
            endDate: iso('12:30', '03-06'), // Tuesday
          },
          {
            startDate: iso('12:30', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('18:30', '03-06'), // Tuesday
          },
          {
            startDate: iso('14:00', '03-07'), // Wednesday
            endDate: iso('15:00', '03-07'), // Wednesday
          },
          {
            startDate: iso('16:00', '03-07'), // Wednesday
            endDate: iso('16:30', '03-07'), // Wednesday
          },
          {
            startDate: iso('17:00', '03-07'), // Wednesday
            endDate: iso('18:00', '03-07'), // Wednesday
          },
          {
            startDate: iso('18:00', '03-07'), // Wednesday
            endDate: iso('19:00', '03-07'), // Wednesday
          },
        ];

        appts2 = [
          {
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          },
          {
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:00', '03-05'), // Monday
          },
          {
            startDate: iso('11:00', '03-05'), // Monday
            endDate: iso('12:00', '03-05'), // Monday
          },
          {
            startDate: iso('12:00', '03-05'), // Monday
            endDate: iso('13:00', '03-05'), // Monday
          },
          {
            startDate: iso('13:00', '03-06'), // Tuesday
            endDate: iso('14:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('14:00', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('16:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('16:00', '03-06'), // Tuesday
            endDate: iso('17:00', '03-06'), // Tuesday
          },
          {
            startDate: iso('17:00', '03-06'), // Tuesday
            endDate: iso('18:00', '03-06'), // Tuesday
          },
        ];
      });

      test('should return 4 days with the correct availabilities', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        account.weeklySchedule = officeHours;
        const {
          availabilities,
          nextAvailability,
          practitionersData,
        } = computeOpeningsAndAvailabilities({
          account,
          service,
          practitioners: [
            {
              id: '1',
              isCustomSchedule: true,
              weeklySchedule,
              appointments: appts1,
              timeOffs: [],
              dailySchedules: [],
            },
            {
              id: '2',
              isCustomSchedule: false,
              appointments: appts2,
              timeOffs: [],
              dailySchedules: [],
            },
          ],

          startDate,
          endDate,
        });

        expect(practitionersData.length).toBe(2);
        expect(nextAvailability.startDate).toBe(iso('13:00', '03-05'));
        expect(availabilities.length).toBe(8);
      });
    });
  });
});
