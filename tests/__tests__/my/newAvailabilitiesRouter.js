
import request from 'supertest';
import app from '../../../server/bin/app';
import { AuthSession, PatientUser, Patient, Practitioner_Service, Account, Enterprise } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { patientUser, patientUserId, seedTestPatients } from '../../util/seedTestPatients';
import { practitionerId, seedTestPractitioners } from '../../util/seedTestPractitioners';
import { serviceId, seedTestService } from '../../util/seedTestServices';
import { accountId } from '../../util/seedTestUsers';
import { omitPropertiesFromBody, omitProperties } from '../../util/selectors';

const practitionerServiceId = '32fbc2a4-69a3-4783-bc7f-53feebd02477';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

const enterprise = {
  id: enterpriseId,
  name: 'Test Enterprise',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const practitionerService = {
  id: practitionerServiceId,
  Practitioner_id: practitionerId,
  Service_id: serviceId,
};

const account = {
  id: accountId,
  enterpriseId,
  name: 'Availabilities Account',
  createdAt: '2017-07-19T00:14:30.932Z',
  timeInterval: 3,
};

async function seedTestData() {
  await wipeModel(Enterprise);
  await Enterprise.save(enterprise);

  await wipeModel(Account);
  await Account.save(account);

  await seedTestService();

  await seedTestPractitioners();

  await wipeModel(Practitioner_Service);
  await Practitioner_Service.save(practitionerService);
}

describe('GET /', () => {
  afterAll(async () => {
    await wipeAllModels();
  });

  beforeEach(async () => {
    await seedTestData();
  });

  // TODO: Figure out why I need to exclude the patientUser field to avoid the circular object
  test('/accounts/:accountId/availabilities - get availabilities', () => {
    return request(app)
      .get(`/accounts/${accountId}/availabilities?startDate=2017-07-19T00:14:30.932Z&endDate=2017-07-27T00:14:30.932Z&serviceId=${serviceId}&practitionerId=${practitionerId}`)
      .set('Host', 'my.test.com')
      .expect(200)
      .then(({ body }) => {
        body.patientUser = omitProperties(body, ['patientUser']);
        expect(body).toMatchSnapshot();
      });
  });
});

