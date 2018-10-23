
import bcrypt from 'bcrypt';
import { Account, AuthSession } from '../../server/_models';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { UserAuth } from '../../server/lib/_auth';
import { seedTestUsers, addressId } from '../util/seedTestUsers';
import { wipeAllModels } from '../util/wipeModel';
import { omitProperties } from '../util/selectors';

const managerEmail = 'manager@test.com';
const managerPassword = '!@CityOfBudaTest#$';
const managerPermissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const newUserId = '31354241-3652-4792-bae5-5bfed53d37b7';
const fakeSessionId = '00054241-3652-4792-bae5-5bfed53d37b7';

const fail = 'Your code should be failing but it is passing';

async function seedData() {
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Account.create({
    id: accountId2,
    enterpriseId,
    addressId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

describe('auth lib', () => {
  // Seed with some standard user data
  beforeAll(async () => {
    await seedData();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#load', () => {
    test('should load the correct model', async () => {
      const user = await UserAuth.load(managerEmail);

      // Need to cleanse off properties here...
      expect(omitProperties(user.dataValues, ['password'])).toMatchSnapshot();
    });

    test('should be falsey if user does not exist', async () => {
      const user = await UserAuth.load('ghost@test.com');
      expect(!user).toBe(true);
    });
  });

  describe('#login', () => {
    test('should return a new session and the user model', async () => {
      const { session, model } = await UserAuth.login(managerEmail, managerPassword);
      expect(omitProperties(model.dataValues, ['password'])).toMatchSnapshot();
      expect(omitProperties(session.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should return a 401 error with the wrong password', async () => {
      try {
        await UserAuth.login(managerEmail, 'HaCkErGuY');
        throw new Error(fail);
      } catch (err) {
        expect(err.message).toBe('Invalid Credentials');
        expect(err.status).toBe(401);
      }
    });
  });

  describe('#signup', () => {
    test('should return create the user and return it with a session', async () => {
      const { session, model } = await UserAuth.signup({
        id: newUserId,
        enterpriseId,
        activeAccountId: accountId,
        // We can get away with this, instead of creating a new permission
        permissionId: managerPermissionId,
        username: 'newuser@test.com',
        password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
        firstName: 'Gary',
        lastName: 'Oldman',
      });

      expect(omitProperties(model.dataValues, ['password'])).toMatchSnapshot();
      expect(omitProperties(session.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should return 400 for email already in use', async () => {
      try {
        await UserAuth.signup({
          id: newUserId,
          enterpriseId,
          activeAccountId: accountId,
          // We can get away with this, instead of creating a new permission
          permissionId: managerPermissionId,
          username: managerEmail,
          password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
          firstName: 'Gary',
          lastName: 'Oldman',
        });

        throw new Error(fail);
      } catch (err) {
        expect(err.message).toBe('Email Already in Use');
        expect(err.status).toBe(400);
      }
    });
  });

  describe('#logout', () => {
    test('should be able to remove the session once it is created', async () => {
      const { session } = await UserAuth.login(managerEmail, managerPassword);
      await UserAuth.logout(session.id);
    });

    test('should not throw an error if session does not exist', async () => {
      await UserAuth.logout(fakeSessionId);
    });
  });

  describe('#updateSession', () => {
    test('should remove the session and return a new one', async () => {
      const { session } = await UserAuth.login(managerEmail, managerPassword);
      const newSession = await UserAuth.updateSession(
        session.id,
        session,
        { accountId: accountId2 },
      );
      const oldSession = await AuthSession.findById(session.id);

      // Now update that session
      expect(oldSession).toBeNull();
      expect(newSession.accountId).toBe(accountId2);
      expect(omitProperties(newSession.dataValues, ['id'])).toMatchSnapshot();
    });
  });
});
