
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

const procedure3 = {
  code: '21241',
  type: 'Test Procedure3',
};

async function seedTestProcedures() {
  await wipeModel(Procedure);

  await Procedure.create(procedure);
  await Procedure.create(procedure2);
  await Procedure.create(procedure3);
}

async function wipeTestProcedures() {
  await wipeModel(Procedure);
}

module.exports = {
  code,
  seedTestProcedures,
  wipeTestProcedures,
};
