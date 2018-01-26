
import { Procedure } from '../../server/_models';
import wipeModel from './wipeModel';

const code = '11111';

const procedure = {
  code: `CDA-${code}`,
  type: 'Test Procedure',
};

const procedure2 = {
  code: '00121',
  type: 'Test Procedure2',
};

async function seedTestProcedures() {
  await wipeModel(Procedure);

  await Procedure.create(procedure);
  await Procedure.create(procedure2);
}

async function wipeTestProcedures() {
  await wipeModel(Procedure);
}

module.exports = {
  code,
  seedTestProcedures,
  wipeTestProcedures,
};
