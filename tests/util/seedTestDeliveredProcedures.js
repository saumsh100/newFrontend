
import { DeliveredProcedure } from '../../server/_models';
import wipeModel from './wipeModel';

const code = '11111';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const patientId = '10518e11-b9d2-4d74-9887-29eaae7b5938';
const id = '12518e11-b9d2-4d74-9887-29eaae7b5938';
const id2 = '12548e11-b9d2-4d74-9887-29eaae7b5938';

const deliveredProcedure1 = {
  id,
  accountId,
  totalAmount: 200.01,
  units: 1.00,
  createdAt: '2017-07-19T00:14:30.932Z',
  entryDate: '2017-07-19T00:14:30.932Z',
  updatedAt: new Date(),
  pmsId: '2',
  patientId,
  procedureCode: code,
  procedureCodeId: `CDA-${code}`,
};

const deliveredProcedure2 = {
  id: id2,
  accountId,
  totalAmount: 232.21,
  units: 1.00,
  createdAt: '2017-07-19T00:14:30.932Z',
  entryDate: '2017-07-19T00:14:30.932Z',
  updatedAt: new Date(),
  patientId,
  procedureCode: code,
  procedureCodeId: `CDA-${code}`,
};

async function seedTestDeliveredProcedures() {
  await wipeModel(DeliveredProcedure);

  await DeliveredProcedure.create(deliveredProcedure1);
  await DeliveredProcedure.create(deliveredProcedure2);
}

async function wipeTestDeliveredProcedures() {
  await wipeModel(DeliveredProcedure);
}

module.exports = {
  seedTestDeliveredProcedures,
  wipeTestDeliveredProcedures,
  deliveredProcedure1,
};
