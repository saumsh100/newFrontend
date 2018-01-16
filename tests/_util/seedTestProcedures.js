
import { Procedure } from '../../server/_models';
import wipeModel from './wipeModel';

const code = '11111';

const procedure = {
  code: `CDA-${code}`,
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
