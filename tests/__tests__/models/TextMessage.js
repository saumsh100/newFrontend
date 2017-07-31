
import { Chat, TextMessage } from '../../../server/_models';
import { omitProperties } from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const chatId = '88a2d812-3a4c-454c-9286-628556563bdc';
const makeData = (data = {}) => Object.assign({
  id: 'uniqueSidFromTwilio',
  chatId,
  from: '+17807807800',
  to: '+17807807800',
}, data);

const makeChatData = (data = {}) => Object.assign({
  id: chatId,
  accountId,
  patientPhoneNumber: '+17807807800',
}, data);

const fakeChatId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/TextMessage', () => {
  beforeEach(async () => {
    await wipeModelSequelize(TextMessage);
    await wipeModelSequelize(Chat);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(TextMessage);
    await wipeModelSequelize(Chat);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a TextMessage without id provided', async () => {
      const data = makeData();
      await Chat.create(makeChatData());
      const textMessage = await TextMessage.create(data);
      expect(omitProperties(textMessage.get({ plain: true }))).toMatchSnapshot();
    });

    test('should have null values for userId', async () => {
      const data = makeData();
      await Chat.create(makeChatData());
      const textMessage = await TextMessage.create(data);
      expect(textMessage.userId).toBe(null);
    });

    test('should throw error for no patientPhoneNumber provided', async () => {
      const data = makeData({ to: undefined });
      await Chat.create(makeChatData());
      try {
        await TextMessage.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ chatId: fakeChatId });
      await Chat.create(makeChatData());
      try {
        await TextMessage.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      await Chat.create(makeChatData());
      const { id } = await TextMessage.create(makeData());
      const textMessage = await TextMessage.findOne({
        where: { id },
        include: [
          {
            model: Chat,
            as: 'chat',
          },
        ],
      });

      expect(textMessage.chatId).toBe(textMessage.chat.id);
    });

    // TODO: add rest of relations tests!
  });
});
