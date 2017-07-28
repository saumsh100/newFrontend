
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Account, Enterprise, Permission, User } from '../../server/models';
import { Account as _Account, Enterprise as _Enterprise, Permission as _Permission, User as _User } from '../../server/_models';
import wipeModel, { wipeModelSequelize } from './wipeModel';

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
  role: _Permission.ROLES.MANAGER,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const ownerPermission = {
  id: ownerPermissionId,
  role: _Permission.ROLES.OWNER,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const superAdminPermission = {
  id: superAdminPermissionId,
  role: _Permission.ROLES.SUPERADMIN,
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

async function seedTestUsers() {
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
}

async function seedTestUsersSequelize() {
  await wipeModelSequelize(_User);
  await wipeModelSequelize(_Permission);
  await wipeModelSequelize(_Account);
  await wipeModelSequelize(_Enterprise);

  await _Enterprise.create(enterprise);
  await _Account.create(account);
  await _Permission.bulkCreate([
    managerPermission,
    ownerPermission,
    superAdminPermission,
  ]);

  await _User.bulkCreate([
    managerUser,
    ownerUser,
    superAdminUser,
  ]);
}

async function wipeTestUsers() {
  await wipeModelSequelize(_User);
  await wipeModelSequelize(_Permission);
  await wipeModelSequelize(_Account);
  await wipeModelSequelize(_Enterprise);
}

module.exports = {
  enterprise,
  enterpriseId,
  accountId,
  managerPermissionId,
  ownerPermissionId,
  superAdminPermissionId,
  managerUserId,
  ownerUserId,
  superAdminUserId,
  seedTestUsers,
  seedTestUsersSequelize,
  wipeTestUsers,
};


 // import bcrypt from 'bcrypt';
 // import { passwordHashSaltRounds } from '../../server/config/globals';
 // import { Account, Enterprise, Permission, User } from '../../server/models';
 // import { Account as _Account, Enterprise as _Enterprise, Permission as _Permission, User as _User } from '../../server/_models';
 // import wipeModel, { wipeModelSequelize } from './wipeModel';
 //
 // const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
 // const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
 // const managerPermissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
 // const ownerPermissionId = '74d4e661-1155-4494-8fdb-c4ec0ddf804d';
 // const superAdminPermissionId = '64d4e661-1155-4494-8fdb-c4ec0ddf804d';
 // const managerUserId = '6668f250-e8c9-46e3-bfff-0249f1eec6b8';
 // const ownerUserId = '5668f250-e8c9-46e3-bfff-0249f1eec6b8';
 // const superAdminUserId = '4668f250-e8c9-46e3-bfff-0249f1eec6b8';
 //
 // const enterprise = {
 // id: enterpriseId,
 // name: 'Test Enterprise',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const account = {
 // id: accountId,
 // enterpriseId,
 // name: 'Test Account',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const managerPermission = {
 // id: managerPermissionId,
 // role: _Permission.ROLES.MANAGER,
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const ownerPermission = {
 // id: ownerPermissionId,
 // role: _Permission.ROLES.OWNER,
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const superAdminPermission = {
 // id: superAdminPermissionId,
 // role: _Permission.ROLES.SUPERADMIN,
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const managerUser = {
 // id: managerUserId,
 // enterpriseId,
 // activeAccountId: accountId,
 // permissionId: managerPermissionId,
 // username: 'manager@test.com',
 // password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
 // firstName: 'Harvey',
 // lastName: 'Dentest',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const ownerUser = {
 // id: ownerUserId,
 // enterpriseId,
 // activeAccountId: accountId,
 // permissionId: ownerPermissionId,
 // username: 'owner@test.com',
 // password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
 // firstName: 'Harvey',
 // lastName: 'Dentest',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const superAdminUser = {
 // id: superAdminUserId,
 // enterpriseId,
 // activeAccountId: accountId,
 // permissionId: superAdminPermissionId,
 // username: 'superadmin@test.com',
 // password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
 // firstName: 'Harvey',
 // lastName: 'Dentest',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 //
 // // Second set
 // const enterpriseId2 = 'c5ab9bc0-0002-4538-99ae-2fe7f920abf4';
 // const accountId2 = '62954241-3652-0002-bae5-5bfed53d37b7';
 // const superAdminPermissionId2 = '64d4e661-0002-4494-8fdb-c4ec0ddf804d';
 // const superAdminUserId2 = '4668f250-0002-46e3-bfff-0249f1eec6b8';
 // const managerUserId2 = '6668f250-0002-46e3-bfff-0249f1eec6b8';
 // const managerPermissionId2 = '84d4e661-0002-4494-8fdb-c4ec0ddf804d';
 // const ownerPermissionId2 = '74d4e661-0002-4494-8fdb-c4ec0ddf804d';
 // const ownerUserId2 = '5668f250-e8c9-0002-bfff-0249f1eec6b8';
 //
 // const enterprise2 = {
 // id: enterpriseId2,
 // name: 'Second Test Enterprise',
 // };
 //
 // const account2 = {
 // id: accountId2,
 // enterpriseId2,
 // name: 'Test Account for second enterprise',
 // };
 //
 // const managerPermission2 = {
 // id: managerPermissionId2,
 // role: _Permission.ROLES.MANAGER,
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const ownerPermission2 = {
 // id: ownerPermissionId2,
 // role: _Permission.ROLES.OWNER,
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const superAdminPermission2 = {
 // id: superAdminPermissionId,
 // role: _Permission.ROLES.SUPERADMIN,
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const managerUser2 = {
 // id: managerUserId2,
 // enterpriseId2,
 // activeAccountId: accountId2,
 // permissionId: managerPermissionId2,
 // username: 'manager2@test.com',
 // password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
 // firstName: 'Harvey2',
 // lastName: 'Dentest',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const ownerUser2 = {
 // id: ownerUserId2,
 // enterpriseId2,
 // activeAccountId: accountId2,
 // permissionId: ownerPermissionId2,
 // username: 'owner2@test.com',
 // password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
 // firstName: 'Harvey2',
 // lastName: 'Dentest',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // const superAdminUser2 = {
 // id: superAdminUserId2,
 // enterpriseId2,
 // activeAccountId: accountId2,
 // permissionId: superAdminPermissionId2,
 // username: 'superadmin2@test.com',
 // password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
 // firstName: 'Harvey2',
 // lastName: 'Dentest',
 // createdAt: '2017-07-19T00:14:30.932Z',
 // };
 //
 // async function seedTestUsers() {
 // // TODO: will be a simple DB wipe with Postgres
 // await wipeModel(Account);
 // await wipeModel(Enterprise);
 // await wipeModel(Permission);
 // await wipeModel(User);
 //
 // await Account.save(account);
 // await Enterprise.save(enterprise);
 // await Permission.save([
 // managerPermission,
 // ownerPermission,
 // superAdminPermission,
 // ]);
 //
 // await User.save([
 // managerUser,
 // ownerUser,
 // superAdminUser,
 // ]);
 //
 // // Second user
 // await Account.save(account2);
 // await Enterprise.save(enterprise2);
 // await Permission.save([
 // managerPermission2,
 // ownerPermission2,
 // superAdminPermission2,
 // ]);
 //
 // await User.save([
 // managerUser2,
 // ownerUser2,
 // superAdminUser2,
 // ]);
 // }
 //
 // async function seedTestUsersSequelize() {
 // // TODO: will be a simple DB wipe with Postgres
 // await wipeModelSequelize(_Account);
 // await wipeModelSequelize(_Enterprise);
 // await wipeModelSequelize(_Permission);
 // await wipeModelSequelize(_User);
 //
 // await _Account.create(account);
 // await _Enterprise.create(enterprise);
 // await _Permission.bulkCreate([
 // managerPermission,
 // ownerPermission,
 // superAdminPermission,
 // ]);
 //
 // await _User.bulkCreate([
 // managerUser,
 // ownerUser,
 // superAdminUser,
 // ]);
 //
 // // Second user
 // await _Account.create(account2);
 // await _Enterprise.create(enterprise2);
 // await _Permission.bulkCreate([
 // managerPermission2,
 // ownerPermission2,
 // superAdminPermission2,
 // ]);
 //
 // await _User.bulkCreate([
 // managerUser2,
 // ownerUser2,
 // superAdminUser2,
 // ]);
 // }
 //
 // module.exports = {
 // enterpriseId,
 // accountId,
 // managerPermissionId,
 // ownerPermissionId,
 // superAdminPermissionId,
 // managerUserId,
 // ownerUserId,
 // superAdminUserId,
 // seedTestUsers,
 // seedTestUsersSequelize,
 // enterpriseId2,
 // accountId2,
 // managerPermissionId2,
 // ownerPermissionId2,
 // superAdminPermissionId2,
 // managerUserId2,
 // ownerUserId2,
 // superAdminUserId2,
 // };

