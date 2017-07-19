
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Account, Enterprise, Permission, User } from '../../server/models';
import wipeModel from './wipeModel';

// TODO: these could be exported from fixtures, or use functions from those files

const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const managerPermissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
const ownerPermissionId = '74d4e661-1155-4494-8fdb-c4ec0ddf804d';
const superAdminPermissionId = '64d4e661-1155-4494-8fdb-c4ec0ddf804d';
const managerUserId = '6668f250-e8c9-46e3-bfff-0249f1eec6b8';
const ownerUserId = '5668f250-e8c9-46e3-bfff-0249f1eec6b8';
const superAdminUserId = '4668f250-e8c9-46e3-bfff-0249f1eec6b8';

const enterprise = {
  id: enterpriseId,
  name: 'Test Enterprise',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const account = {
  id: accountId,
  enterpriseId,
  name: 'Test Account',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const managerPermission = {
  id: managerPermissionId,
  role: 'MANAGER',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const ownerPermission = {
  id: ownerPermissionId,
  role: 'OWNER',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const superAdminPermission = {
  id: superAdminPermissionId,
  role: 'SUPERADMIN',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const managerUser = {
  id: managerUserId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId: managerPermissionId,
  username: 'manager@test.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const ownerUser = {
  id: ownerUserId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId: ownerPermissionId,
  username: 'owner@test.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const superAdminUser = {
  id: superAdminUserId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId: superAdminPermissionId,
  username: 'superadmin@test.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
  createdAt: '2017-07-19T00:14:30.932Z',
};

export default async function seedTestUsers() {
  // TODO: will be a simple DB wipe with Postgres
  await wipeModel(Account);
  await wipeModel(Enterprise);
  await wipeModel(Permission);
  await wipeModel(User);

  await Account.save(account);
  await Enterprise.save(enterprise);
  await Permission.save([
    managerPermission,
    ownerPermission,
    superAdminPermission,
  ]);

  await User.save([
    managerUser,
    ownerUser,
    superAdminUser,
  ]);
};
