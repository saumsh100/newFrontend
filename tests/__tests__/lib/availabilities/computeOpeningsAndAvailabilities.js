
import { v4 as uuid } from 'uuid';
import moment from 'moment-timezone';
import computeOpeningsAndAvailabilities
  from '../../../../server/lib/availabilities/computeOpeningsAndAvailabilities';
import logger from "../../../../server/config/logger";
import {printPractitionersData} from "../../../../server/lib/availabilities/helpers/print";

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

// generateAppointmentData, meant to be simple variable name to save space
const a = (data = {}) => ({
  id: uuid(),
  ...data,
});

const generateReasonDailyHours = (data = {}) => ({
  isClosed: false,
  availabilities: [],
  timeOffs: [],
  ...data,
});

const generateReasonWeeklyHours = (data = {}) => ({
  sundayHours: generateReasonDailyHours(),
  mondayHours: generateReasonDailyHours(),
  tuesdayHours: generateReasonDailyHours(),
  wednesdayHours: generateReasonDailyHours(),
  thursdayHours: generateReasonDailyHours(),
  fridayHours: generateReasonDailyHours(),
  saturdayHours: generateReasonDailyHours(),
  ...data,
});

describe('Availabilities Library', () => {
  let account;
  beforeEach(() => {
    account = DEFAULT_ACCOUNT;
  });

  describe('#computeOpeningsAndAvailabilities', () => {
    describe('Integration Tests - General Scenario Accross 4 Days with 2 Practitioners', () => {
      let weeklySchedule;
      let officeHours;
      let appts1;
      let appts2;
      let service;
      let practitioners;
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

        appts2 = [
          a({
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          }),
          a({
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:00', '03-05'), // Monday
          }),
          a({
            startDate: iso('11:00', '03-05'), // Monday
            endDate: iso('12:00', '03-05'), // Monday
          }),
          a({
            startDate: iso('12:00', '03-05'), // Monday
            endDate: iso('13:00', '03-05'), // Monday
          }),
          a({
            startDate: iso('13:00', '03-06'), // Tuesday
            endDate: iso('14:00', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('14:00', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('16:00', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('16:00', '03-06'), // Tuesday
            endDate: iso('17:00', '03-06'), // Tuesday
          }),
          a({
            startDate: iso('17:00', '03-06'), // Tuesday
            endDate: iso('18:00', '03-06'), // Tuesday
          }),
        ];

        practitioners = [
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
        ];
      });

      test('should return 4 days with the correct availabilities', () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-06'); // Tuesday evening
        account.weeklySchedule = officeHours;
        const {
          availabilities,
          nextAvailability,
          practitionersData,
        } = computeOpeningsAndAvailabilities({
          account,
          service,
          practitioners,
          startDate,
          endDate,
        });

        expect(practitionersData.length).toBe(2);
        expect(nextAvailability.startDate).toBe(iso('13:00', '03-05'));
        expect(availabilities.length).toBe(7); // Office Hours blocks off the potential 8th on Thursday
      });

      describe('Availability Overrides w/ ReasonWeeklyHours', () => {
        test('should not do anything different for reasonWeeklyHours always being opened', () => {
          const startDate = iso('06:00', '03-05'); // Monday morning
          const endDate = iso('18:00', '03-06'); // Wednesday evening
          account.weeklySchedule = officeHours;

          // Set up the reasonWeeklyHours data
          service.reasonWeeklyHours = generateReasonWeeklyHours();

          const {
            availabilities,
            nextAvailability,
            practitionersData,
          } = computeOpeningsAndAvailabilities({
            account,
            service,
            practitioners,
            startDate,
            endDate,
          });

          expect(practitionersData.length).toBe(2);
          expect(nextAvailability.startDate).toBe(iso('13:00', '03-05'));
          expect(availabilities.length).toBe(7);
        });

        test('should not return anything for tuesday as the reasonWeeklyHours have it closed', () => {
          const startDate = iso('06:00', '03-05'); // Monday morning
          const endDate = iso('18:00', '03-06'); // Wednesday evening
          account.weeklySchedule = officeHours;

          // Set up the reasonWeeklyHours data
          service.reasonWeeklyHours = generateReasonWeeklyHours({
            tuesdayHours: generateReasonDailyHours({ isClosed: true }),
          });

          const {
            availabilities,
            nextAvailability,
            practitionersData,
          } = computeOpeningsAndAvailabilities({
            account,
            service,
            practitioners,
            startDate,
            endDate,
          });

          expect(practitionersData.length).toBe(2);
          expect(nextAvailability.startDate).toBe(iso('13:00', '03-05'));
          expect(availabilities.length).toBe(4); // Tuesday is closed according to ReasonWeeklyHours
        });

        test('should not return anything for tuesday as the reasonWeeklyHours have a timeOff over entire day', () => {
          const startDate = iso('06:00', '03-05'); // Monday morning
          const endDate = iso('18:00', '03-06'); // Wednesday evening
          account.weeklySchedule = officeHours;

          // Set up the reasonWeeklyHours data
          service.reasonWeeklyHours = generateReasonWeeklyHours({
            tuesdayHours: generateReasonDailyHours({
              timeOffs: [{
                // essentially block off the whole day
                startTime: '01:00:00',
                endTime: '23:00:00',
              }],
            }),
          });

          const {
            availabilities,
            nextAvailability,
            practitionersData,
          } = computeOpeningsAndAvailabilities({
            account,
            service,
            practitioners,
            startDate,
            endDate,
          });

          expect(practitionersData.length).toBe(2);
          expect(nextAvailability.startDate).toBe(iso('13:00', '03-05'));
          expect(availabilities.length).toBe(4); // Tuesday has a timeOff over the entire day
        });

        test('should return 2 availabilities, 1 per day as they are "set" availabilities', () => {
          const startDate = iso('06:00', '03-05'); // Monday morning
          const endDate = iso('18:00', '03-06'); // Wednesday evening
          account.weeklySchedule = officeHours;

          // Set up the reasonWeeklyHours data
          service.reasonWeeklyHours = generateReasonWeeklyHours({
            mondayHours: generateReasonDailyHours({
              availabilities: [{
                // essentially block off the whole day
                startTime: '09:00:00',
                endTime: '11:00:00',
              }],
            }),

            tuesdayHours: generateReasonDailyHours({
              availabilities: [{
                // essentially block off the whole day
                startTime: '11:00:00',
                endTime: '13:00:00',
              }],
            }),
          });

          const {
            availabilities,
            nextAvailability,
            practitionersData,
          } = computeOpeningsAndAvailabilities({
            account,
            service,
            practitioners,
            startDate,
            endDate,
          });

          expect(practitionersData.length).toBe(2);
          expect(nextAvailability.startDate).toBe(iso('09:00', '03-05'));
          expect(availabilities.length).toBe(2); // Tuesday has a timeOff over the entire day
        });
      });
    });
  });
});
