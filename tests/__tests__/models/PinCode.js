
import { PinCode } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

const modelId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/PinCode', () => {
  beforeEach(async () => {
    await wipeModelSequelize(PinCode);
  });

  afterAll(async () => {
    await wipeModelSequelize(PinCode);
  });

  describe('Data Validation', () => {
    test('should be able to save a PinCode without id provided', async () => {
      const pinCode = await PinCode.create({ pinCode: '1111', modelId });
      expect(omitProperties(pinCode.dataValues)).toMatchSnapshot();
    });

    test('should have a default PinCode of length 4', async () => {
      const { pinCode } = await PinCode.create({ modelId });
      expect(typeof pinCode).toBe('string');
      expect(pinCode.length).toBe(4);
    });

    test('should throw error for modelId not a UUID', async () => {
      try {
        await PinCode.create({ modelId: 'cat' });
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeDatabaseError');
      }
    });
  });
});
