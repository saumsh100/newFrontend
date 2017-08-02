
import { Service } from '../../server/_models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';

const serviceId = 'c5beec65-73a0-4b58-ba48-65986931d054';

const service = {
  id: serviceId,
  name: 'Test Service',
  accountId,
  duration: 4,
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestService() {
  await wipeModel(Service);
  await Service.create(service);
}

module.exports = {
  serviceId,
  service,
  seedTestService,
};
