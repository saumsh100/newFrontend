import request from 'supertest';
import app from '../../../server/bin/app';
import { seedTestAvailabilitiesSequelize, wipeTestAvailabilities } from '../../util/seedTestAvailabilities';
import { omitProperties } from '../../util/selectors';
import { Practitioner, WeeklySchedule } from '../../../server/_models';

const host = 'my2.test.com';

const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = 'e18bd613-c76b-4a9a-a1df-850c867b2cab';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';


describe('GET /', () => {
  afterAll(async () => {
    await wipeTestAvailabilities();
  });

  beforeEach(async () => {
    await wipeTestAvailabilities();
    await seedTestAvailabilitiesSequelize();
  });

  // TODO: Figure out why I need to exclude the patientUser field to avoid the circular object
  test('/accounts/:accountId/availabilities - get availabilities', async () => {
    const practitioners = await Practitioner.findAll({
      where: {id: practitionerId},
      include: [{
        model: WeeklySchedule,
        as: 'weeklySchedule',
      }],
      raw: true,
      nest: true,
    });

    return request(app)
      .get(`/accounts/${accountId}/availabilities?startDate=2018-07-19T00:14:30.932Z&endDate=2018-07-27T00:14:30.932Z&serviceId=${serviceId}&practitionerId=${practitionerId}`)
      .set('Host', host)
      .expect(200)
      .then(({ body }) => {
        body.patientUser = omitProperties(body, ['patientUser']);
        expect(body).toMatchSnapshot();
      });
  });
});

