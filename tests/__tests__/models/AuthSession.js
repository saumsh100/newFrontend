
import { AuthSession } from '../../../server/_models';
import { wipeModelSequelize } from '../../util/wipeModel';
import { omitProperties }  from '../../util/selectors';

const modelId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeData = (data = {}) => (Object.assign({
  modelId,
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/AuthSession', () => {
  beforeEach(async () => {
    await wipeModelSequelize(AuthSession);
  });

  afterAll(async () => {
    await wipeModelSequelize(AuthSession);
  });

  describe('Data Validation', () => {
    test('should be able to save a AuthSession without id provided', async () => {
      const data = makeData();
      const enterprise = await AuthSession.create(data);
      expect(omitProperties(enterprise.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should throw error for modelId not a uuid', async () => {
      const data = makeData({ modelId: 'cat' });
      try {
        await AuthSession.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeDatabaseError');
      }
    });
  });
});
