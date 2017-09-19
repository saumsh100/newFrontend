
import { Procedure } from '../../server/_models';
import wipeModel from './wipeModel';

const code = '11111';

const procedure = {
  code,
  entryDate: '2017-07-19T00:14:30.932Z',
  type: 'Test Procedure',
};

async function seedTestProcedures() {
  await wipeModel(Procedure);

  await Procedure.create(procedure);
}

async function wipeTestProcedures() {
  await wipeModel(Procedure);
}

module.exports = {
  code,
  seedTestProcedures,
  wipeTestProcedures,
};
