
import uuid from 'uuid';
import { Account, Chat, OutsideOfficeHoursMessage, TextMessage } from 'CareCruModels';
import { canReceiveMessage, isLimitReachedForPhoneNumber } from './limitOutOfOfficeHoursReplays';
import { seedTestUsers, accountId, enterpriseId } from '../../../tests/util/seedTestUsers';
import { seedTestPatients } from '../../../tests/util/seedTestPatients';
import { seedTestChats, chatId as seededChatId, patientPhoneNumber } from '../../../tests/util/seedTestChats';
import { wipeAllModels } from '../../../tests/util/wipeModel';

describe('services.schedule.limitOutOfOfficeHoursReplays', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatients();
    await seedTestChats();
    await Account.update({ responseOutsideOfficeHoursLimitBuffer: '1 hour' }, { where: { id: accountId } });
    const seededMessageId = uuid();
    await TextMessage.create({
      id: seededMessageId,
      chatId: seededChatId,
      to: patientPhoneNumber,
      from: '+16043333333',
      read: true,
      body: 'This is a test text message',
      createdAt: '2018-10-30 08:30:35.121+00',
      userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
      isOutsideOfficeHoursRespond: true,
    });
    await Chat.update({
      lastTextMessageId: seededMessageId,
      lastTextMessageDate: '2018-10-30 08:30:35.121+00',
    }, { where: { id: seededChatId } });

    jest.spyOn(Date, 'now');
    Date.now.mockImplementation(() => 1540890000000); // Tuesday, October 30, 2018 9:00:00 AM
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('canReceiveMessage', () => {
    it('returns false if message is received within the buffer', async () => {
      const canReceive = await canReceiveMessage(accountId, patientPhoneNumber, '1 hour');
      expect(canReceive).toBe(false);
    });

    it('returns true if message is received outside the buffer', async () => {
      const canReceive = await canReceiveMessage(accountId, '+16045555553', '1 hour');
      expect(canReceive).toBe(true);
    });
  });

  describe('isLimitReachedForNumber', () => {
    it('returns false if account doesn\'t have the buffer set', async () => {
      const isLimitReached = await isLimitReachedForPhoneNumber(enterpriseId, patientPhoneNumber);
      expect(isLimitReached).toBe(false);
    });
  });
});
