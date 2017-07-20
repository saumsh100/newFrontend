
import bcrypt from 'bcrypt';
import jwt from 'jwt-decode';
import request from 'supertest';
import { passwordHashSaltRounds } from '../../../server/config/globals';
import app from '../../../server/bin/app';
import { Account, Enterprise, Permission, User } from '../../../server/models';
import wipeModel from '../../util/wipeModel';
import generateToken from './util/generateToken';

const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const permissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
const userId = '6668f250-e8c9-46e3-bfff-0249f1eec6b8';

const enterprise = {
  id: enterpriseId,
  name: 'Test Enterprise',
};

const account = {
  id: accountId,
  enterpriseId,
  name: 'Test Account',
};

const permission = {
  id: permissionId,
  role: 'ADMIN',
};

const user = {
  id: userId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId,
  username: 'test@carecru.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
};

describe('/auth', () => {
  // Clear what is necessary
  beforeEach(async () => {
    // TODO: this was just easy to do for now, should wipe the whole DB...
    // TODO: with postgres this should be easy
    await wipeModel(Account);
    await wipeModel(Enterprise);
    await wipeModel(Permission);
    await wipeModel(User);

    await Account.save(account);
    await Enterprise.save(enterprise);
    await Permission.save(permission);
    await User.save(user);
  });

  test('POST /auth - Success', () => {
    return request(app).post('/auth')
      .send({ username: 'test@carecru.com', password: '!@CityOfBudaTest#$' })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.token).toBe('string');
      });
  });

  test('POST /auth - Invalid Credentials', () => {
    return request(app).post('/auth')
      .send({ username: 'test@carecru.com', password: '!@CityOfBudaTest#$' })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.token).toBe('string');
      });
  });

  /*
  test('DELETE /auth/session/:sessionId', async () => {
    const token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
    const sessionId = jwt(token);
    return request(app).delete(`/auth/session/${sessionId}`)
      .send()
      .expect(200);
  });
  */

});
