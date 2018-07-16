
import { Chat } from '../../_models';
import { accountId, seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import { patientId, seedTestPatients } from '../../../tests/util/seedTestPatients';
import { omitProperties } from '../../../tests/util/selectors';
import { seedTestChats, chatId as seededChatId } from '../../../tests/util/seedTestChats';
import { createChat, updateLastMessageData } from './chat';

const textMessageId = '059987cb-3051-4656-98d0-72cda34d32a6';
const textMessageDate = '2017-07-19T00:14:30.932Z';
const patientPhoneNumber = '+16045555555';

const chatTest = {
  id: seededChatId,
  accountId,
  patientId,
  patientPhoneNumber,
  lastTextMessageDate: '2017-07-22T00:14:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
};

describe('services.chat', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatients();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  it('creates a new chat', async () => {
    const result = await createChat(chatTest);
    expect(omitProperties(result)).toMatchSnapshot();
  });

  it('updates info for last message', async () => {
    await seedTestChats();
    await updateLastMessageData(seededChatId, textMessageId, textMessageDate);

    const result = await Chat.findById(seededChatId, { raw: true });

    expect(omitProperties(result)).toMatchSnapshot();
    expect(result.lastTextMessageId).toBe(textMessageId);
    expect(result.lastTextMessageDate.toISOString()).toBe(textMessageDate);
  });
});
