
import isArray from 'lodash/isArray';
import {
  Practitioner,
  Practitioner_Service,
  Appointment,
  PractitionerRecurringTimeOff,
} from '../../../../server/_models';
import { seedTestAvailabilities } from '../../../util/seedTestAvailabilities';
import fetchStaticDataForAvailabilities from '../../../../server/lib/availabilities/fetchStaticDataForAvailabilities';
import { wipeAllModels } from '../../../util/wipeModel';

const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';

const makePractData = data => Object.assign({}, {
  accountId,
  isActive: true,
  isHidden: false,
}, data);

async function seedPractitionerService(practitionerId, serviceId) {
  return await Practitioner_Service.create({
    practitionerId,
    serviceId,
  });
}

describe('Availabilities Library', () => {
  beforeAll(async () => {
    await seedTestAvailabilities();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Availablilities Helper', () => {
    describe('#fetchStaticDataForAvailabilities.js', () => {
      let practitioners;
      beforeAll(async () => {
        practitioners = await Practitioner.bulkCreate([
          makePractData({ firstName: 'Jack' }),
          makePractData({ firstName: 'Jeff' }),
        ]);

        for (const practitioner of practitioners) {
          await seedPractitionerService(practitioner.id, serviceId);
        }
      });

      test('should fetch the correct account, service, practitioners, and chairs', async () => {
        const {
          account,
          service,
          practitioners,
          chairs,
        } = await fetchStaticDataForAvailabilities({
          accountId,
          serviceId,
        });

        expect(account.id).toBe(accountId);
        expect(service.id).toBe(serviceId);
        expect(!!account.weeklySchedule).toBe(true);

        expect(isArray(practitioners)).toBe(true);
        expect(isArray(chairs)).toBe(true);
        expect(practitioners.length).toBe(4);
        expect(chairs.length).toBe(2);
      });

      test('should fetch the correct account, service, 1 practitioner, and chairs', async () => {
        const {
          account,
          service,
          practitioners,
          chairs,
        } = await fetchStaticDataForAvailabilities({
          accountId,
          serviceId,
          practitionerId: '4f439ff8-c55d-4423-9316-a41240c4d329',
        });

        expect(account.id).toBe(accountId);
        expect(service.id).toBe(serviceId);
        expect(!!account.weeklySchedule).toBe(true);

        expect(isArray(practitioners)).toBe(true);
        expect(isArray(chairs)).toBe(true);
        expect(practitioners.length).toBe(1);
        expect(chairs.length).toBe(2);
      });
    });
  });
});
