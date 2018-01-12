
import { Account, DeliveredProcedure, Procedure } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { accountId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import wipeModel from '../../_util/wipeModel';
import { patientId, seedTestPatients, wipeTestPatients } from '../../_util/seedTestPatients';
import { code, seedTestProcedures, wipeTestProcedures } from '../../_util/seedTestProcedures';

const makeDeliveredProcedure = procedureCode => Object.assign({}, {
  accountId,
  patientId,
  procedureCode,
  entryDate: '2017-07-19T00:14:30.932Z',
});


describe('models/Account', () => {
  beforeEach(async () => {
    await wipeModel(DeliveredProcedure);
    await seedTestUsers();
    await seedTestPatients();
    await seedTestProcedures();
  });

  afterAll(async () => {
    await wipeModel(DeliveredProcedure);
    await wipeTestProcedures();
    await wipeTestPatients();
    await wipeTestUsers();
  });

  describe('Data Validation', () => {
    test('should create a DeliveredProcedure with CDA at beginning', async () => {
      const data = makeDeliveredProcedure(code);
      const deliveredProcedure = await DeliveredProcedure.create(data);
      expect(deliveredProcedure.procedureCodeId).toEqual('CDA-11111');
    });

    test('should bulk create DeliveredProcedures with CDA at beginning', async () => {
      const data = makeDeliveredProcedure(code);
      const data2 = makeDeliveredProcedure(code);
      const deliveredProcedures = await DeliveredProcedure.bulkCreate([data, data2]);
      expect(deliveredProcedures[0].procedureCodeId).toEqual('CDA-11111');
      expect(deliveredProcedures[1].procedureCodeId).toEqual('CDA-11111');
    });

    test('should create a DeliveredProcedure with a New CDA Code at beginning', async () => {
      const data = makeDeliveredProcedure('1321312');
      const deliveredProcedure = await DeliveredProcedure.create(data);

      const procedure = await Procedure.findOne({
        where: {
          code: 'CDA-1321312',
        },
      });
      expect(procedure.isValidated).toEqual(false);
      expect(deliveredProcedure.procedureCodeId).toEqual('CDA-1321312');
    });

    test('should bulk create DeliveredProcedures with a New CDA Code at beginning', async () => {
      const data = makeDeliveredProcedure('1321312');
      const data2 = makeDeliveredProcedure('1321313');

      await DeliveredProcedure.bulkCreate([data, data2]);

      const procedure = await Procedure.findOne({
        where: {
          code: 'CDA-1321312',
        },
      });

      const procedure2 = await Procedure.findOne({
        where: {
          code: 'CDA-1321313',
        },
      });
      expect(procedure.isValidated).toEqual(false);
      expect(procedure2.isValidated).toEqual(false);
    });
  });
});
