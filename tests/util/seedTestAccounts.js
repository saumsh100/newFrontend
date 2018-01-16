
import { Account, Enterprise } from '../../server/models';
import { Account as _Account, Enterprise as _Enterprise, Address as _Address } from '../../server/_models';
import wipeModel, { wipeModelSequelize } from './wipeModel';

const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const addressId = '62954242-3652-4792-bae5-5bfed53d37b7';

const enterprise = {
  id: enterpriseId,
  name: 'Test Enterprise',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const account = {
  id: accountId,
  addressId,
  enterpriseId,
  name: 'Test Account',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestAccounts() {
  // TODO: will be a simple DB wipe with Postgres
  await wipeModel(Account);
  await wipeModel(Enterprise);

  await Account.save(account);
  await Enterprise.save(enterprise);
}

async function _wipeTestAccounts() {
  await wipeModel(Account);
  await wipeModel(Enterprise);
}

async function wipeTestAccounts() {
  await wipeModelSequelize(_Address);
  await wipeModelSequelize(_Account);
  await wipeModelSequelize(_Enterprise);
}

async function seedTestAccountsSequelize() {
  await wipeTestAccounts();
  await _Address.create(address);
  await _Enterprise.create(enterprise);
  await _Account.create(account);
}

module.exports = {
  enterpriseId,
  accountId,
  seedTestAccounts,
  wipeTestAccounts,
  _wipeTestAccounts,
  seedTestAccountsSequelize,
};
