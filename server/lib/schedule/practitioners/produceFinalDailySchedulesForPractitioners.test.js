
import * as finalDailySchedule from './produceFinalDailySchedulesForPractitioners';
import fetchStaticDataForAvailabilities from '../../availabilities/fetchStaticDataForAvailabilities';
import fetchDynamicDataForAvailabilities from '../../availabilities/fetchDynamicDataForAvailabilities';
import generateDailySchedulesForPractitioners from './produceFinalDailySchedulesForPractitioners';
import produceFinalDailySchedulesMap from './produceFinalDailySchedulesMap';
import StatusError from '../../../util/StatusError';
import { practitionerId } from '../../../../tests/util/seedTestPractitioners';
import { accountId } from '../../../../tests/util/seedTestUsers';
import { weeklySchedule, officeHour } from '../../../../tests/util/seedTestWeeklySchedules';

jest.mock('../../availabilities/fetchStaticDataForAvailabilities');
jest.mock('../../availabilities/fetchDynamicDataForAvailabilities');
jest.mock('./produceFinalDailySchedulesMap');

const anotherPractitionerId = '1230f60a-ec83-431f-a67e-28142ab43caa';

const testWeeklySchedule = {
  ...weeklySchedule,
  breaks: [
    {
      startTime: '2018-01-01T20:00:00.000Z',
      endTime: '2018-01-01T21:00:00.000Z',
    },
  ],
  endTime: '2018-01-02T01:00:00.000Z',
  startTime: '2018-01-01T16:00:00.000Z',
  isDailySchedule: false,
  isClosed: true,
};

const testOfficeHour = {
  ...officeHour,
  breaks: [],
  endTime: '2018-01-02T01:00:00.000Z',
  startTime: '2018-01-01T16:00:00.000Z',
  isDailySchedule: false,
  isClosed: true,
};

const practitioner1 = {
  id: practitionerId,
  accountId,
};

const practitioner2 = {
  id: anotherPractitionerId,
  accountId,
};

const account = {
  dataValues: {
    id: accountId,
    timezone: 'America/Vancouver',
  },
  weeklySchedule: testOfficeHour,
};

const finalDailyScheduleForPractitioner1 = {
  '2018-01-01': {
    ...testOfficeHour,
    isModifiedByTimeOff: false,
  },
  '2018-01-02': {
    ...testOfficeHour,
    isModifiedByTimeOff: false,
  },
};

const practitioners = [practitioner1, practitioner2];

describe('generate final daily schedule tests', () => {
  let finalDailyScheduleMock;

  beforeAll(async () => {
    finalDailyScheduleMock = jest.spyOn(finalDailySchedule, 'findWeeklyScheduleById');
    finalDailyScheduleMock.mockImplementation(() => testWeeklySchedule);
  });

  afterEach(async () => {
    fetchStaticDataForAvailabilities.mockClear();
    fetchDynamicDataForAvailabilities.mockClear();
  });

  afterAll(async () => {
    finalDailyScheduleMock.mockRestore();
    fetchStaticDataForAvailabilities.mockReset();
    fetchDynamicDataForAvailabilities.mockReset();
  });

  test('generateDailySchedulesForPractitioners should throw exception if no practitioner is returned by fetchDynamicDataForAvailabilities', async () => {
    fetchStaticDataForAvailabilities.mockReturnValue({ account });
    fetchDynamicDataForAvailabilities.mockReturnValue({ practitioners: [] });
    await expect(generateDailySchedulesForPractitioners(practitioners, '2018-01-01', '2018-01-02'))
      .rejects.toThrow(StatusError);
  });

  test('generateDailySchedulesForPractitioners should format the result from produceFinalDailySchedulesMap', async () => {
    fetchStaticDataForAvailabilities.mockReturnValue({ account });
    fetchDynamicDataForAvailabilities.mockReturnValue({ practitioners: [practitioner1] });
    produceFinalDailySchedulesMap.mockReturnValue(finalDailyScheduleForPractitioner1);
    expect(await generateDailySchedulesForPractitioners(practitioners, '2018-01-01', '2018-01-02'))
      .toMatchSnapshot();
  });
});
