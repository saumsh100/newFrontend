
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';

const rootUrl = '/api/analytics';

describe('api/analytics', () => {
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({
      username: 'manager@test.com',
      password: '!@CityOfBudaTest#$',
    });
  });

  afterAll(async () => {
    await wipeTestUsers();
  });

  describe.skip('GET /', () => {
    test('/signUrl - returns valid url', () => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1));

      return request(app)
        .get(`${rootUrl}/signUrl?url=https://modeanalytics.com/carecru/reports/b066e775f66a/embed?access_key=sdfsdfs%26max_age=1600%26param_account_name=a25cdce2-d696-43c8-bde7-fe3c1ccc945e%26param_end_date=2018-12-04%26param_start_date=2018-10-01`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });
});
