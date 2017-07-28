
import { Token } from '../../../server/_models';
import { wipeModelSequelize }  from '../../util/wipeModel';

const modelId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Token', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Token);
  });

  afterAll(async () => {
    await wipeModelSequelize(Token);
  });

  describe('Data Validation', () => {
    test('should have an appointmentId of null', async () => {
      const token = await Token.create({ id: 'cat' });
      expect(token.appointmentId).toBe(null);
    });

    test('should throw error if id is not a UUID', async () => {
      try {
        await Token.create({});
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeDatabaseError');
      }
    });
  });
});
