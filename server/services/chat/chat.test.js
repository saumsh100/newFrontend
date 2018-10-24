
import { Chat } from '../../_models';
import { seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import { patient, seedTestPatients } from '../../../tests/util/seedTestPatients';
import {
  getModelsArray,
  omitProperties,
  omitPropertiesFromArray,
} from '../../../tests/util/selectors';
import { seedTestChats, chatId as seededChatId } from '../../../tests/util/seedTestChats';
import { sendSMS } from '../sms';
import * as chatService from './';

jest.mock('../sms');

const textMessageId = '059987cb-3051-4656-98d0-72cda34d32a6';
const chatId = '3180a744-f6b0-4a09-8046-4e713bf5b565';
const clinicPhone = '+16043333333';
const patientPhoneNumber = '+16045555555';

const textMessageTest = {
  id: textMessageId,
  chatId,
  to: patientPhoneNumber,
  from: clinicPhone,
  body: 'This is a test text message',
  userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
};

describe('services.chat', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatients();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('creating message', () => {
    beforeAll(async () => {
      sendSMS.mockResolvedValue({ id: '16045555551' });
    });

    it('creates a new chat for message if it doesnt exist', async () => {
      const { body, userId } = textMessageTest;
      const result = await chatService.sendMessage(patient.mobilePhoneNumber, body, patient.accountId, userId);
      const omitedMessage = omitProperties(result, ['id', 'user', 'chatId']);

      expect(result.id).toBeDefined();
      expect(result.chatId).toBeDefined();
      expect(omitedMessage).toMatchSnapshot();
    });

    it('uses an existing chat to insert a message into', async () => {
      await seedTestChats();
      const createChatMock = jest.spyOn(Chat, 'create');
      const { body, userId } = textMessageTest;

      const result = await chatService.sendMessage(patient.mobilePhoneNumber, body, patient.accountId, userId);
      const omitedMessage = omitProperties(result, ['id', 'user', 'chatId']);

      expect(createChatMock).not.toHaveBeenCalled();
      expect(result.id).toBeDefined();
      expect(result.chatId).toBeDefined();
      expect(omitedMessage).toMatchSnapshot();
    });
  });

  it('marks message as unread', async () => {
    await seedTestChats();
    const date = '2017-07-20T00:14:30.932Z';

    const result = await chatService.markMessagesAsUnread(seededChatId, date, patientPhoneNumber);
    const data = getModelsArray('textMessages', result);
    const omitedMessage = omitPropertiesFromArray(data, ['id', 'user', 'chatId']);
    const chat = await Chat.findById(seededChatId);

    expect(chat.get('hasUnread')).toBe(true);
    expect(omitedMessage).toMatchSnapshot();
  });

  it('marks message as read', async () => {
    await seedTestChats();

    const result = await chatService.markMessagesAsRead(seededChatId);
    const data = getModelsArray('textMessages', result);
    const omitedMessage = omitPropertiesFromArray(data, ['id', 'user', 'chatId']);
    const chat = await Chat.findById(seededChatId);

    expect(chat.get('hasUnread')).toBe(false);
    expect(omitedMessage).toMatchSnapshot();
  });
});
