
import { v4 as uuid } from 'uuid';
import { WeeklySchedule, Chat, Account, AccountTemplate, Template } from 'CareCruModels';
import { setDateToTimezone } from '@carecru/isomorphic';
import { saveWeeklyScheduleWithDefaults } from '../../_models/WeeklySchedule';
import { seedTestUsers, accountId } from '../../../tests/util/seedTestUsers';
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

const weeklyScheduleId = uuid();
const schedule = {
  id: weeklyScheduleId,
  startDate: '2018-04-02T00:00:00.000Z',
  isAdvanced: false,
  monday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T21:00:00.000Z',
    pmsScheduleId: null,
  },
  tuesday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T15:10:00.000Z',
    pmsScheduleId: null,
  },
  wednesday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  thursday: {
    breaks: [],
    startTime: '1970-01-31T14:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T15:00:00.000Z',
    pmsScheduleId: null,
  },
  friday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  saturday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: true,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  sunday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: true,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  pmsId: '23',
  weeklySchedules: null,
};

describe('services.chat', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatients();
    await saveWeeklyScheduleWithDefaults({}, WeeklySchedule);
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('receive message', () => {
    beforeAll(async () => {
      jest.spyOn(Date, 'now');
      await saveWeeklyScheduleWithDefaults(schedule, WeeklySchedule);
      await Account.update({ weeklyScheduleId }, { where: { id: accountId } });
      await Account.update({
        weeklyScheduleId,
        canAutoRespondOutsideOfficeHours: true,
        bufferBeforeOpening: '-30 minutes',
        bufferAfterClosing: '30 minutes',
        autoRespondOutsideOfficeHoursLimit: '15 minutes',
      }, { where: { id: accountId } });

      const template = await Template.create({
        templateName: 'donna-respond-outside-office-hours',
        values: {
          'account.name': true,
          nextOpenedTime: true,
        },
      });
      await AccountTemplate.create({
        templateId: template.get('id'),
        value: 'Practice is currently closed, the next opening time is ${nextOpenedTime}.',
      });

      jest.spyOn(chatService, 'sendMessage');
      chatService.sendMessage.mockImplementation((from, message) => ({
        from,
        message,
        accountId,
      }));
    });

    afterAll(() => {
      chatService.sendMessage.mockRestore();
    });

    describe('within office hours', () => {
      afterEach(() => {
        Date.now.mockClear();
      });

      it('Confirm with extra text - message: C can I say Yes?', async () => {
        const mockedDate = setDateToTimezone('2018-10-29 09:30', 'America/Vancouver');
        jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.toDate().getTime());

        sendSMS.mockResolvedValue({ id: '16045555552' });
        const account = await Account.findByPk(accountId);
        const res = await chatService.receiveMessage(account, {
          id: 'bff6f250-e8c9-46e3-bfff-0249f1eec6b8',
          from: patient.mobilePhoneNumber,
          to: clinicPhone,
          body: 'C can I say Yes?',
        });

        expect(res).toBe(false);
      });

      it('Confirm without extra text', async () => {
        const mockedDate = setDateToTimezone('2018-10-30 09:30', 'America/Vancouver');
        jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.toDate().getTime());

        sendSMS.mockResolvedValue({ id: '16045555503' });
        const account = await Account.findByPk(accountId);
        const res = await chatService.receiveMessage(account, {
          id: '2ff6f250-e8c9-46e3-bfff-0249f1eec6b8',
          from: patient.mobilePhoneNumber,
          to: clinicPhone,
          body: 'C',
        });

        expect(res).toBe(false);
      });
    });

    describe('outside of office hours', () => {
      afterEach(() => {
        Date.now.mockClear();
      });

      it('Confirm with extra text - message: C can I say Yes?', async () => {
        const mockedDate = setDateToTimezone('2018-10-29 07:00', 'America/Vancouver');
        jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.toDate().getTime());

        sendSMS.mockResolvedValue({ id: '16045555553' });
        const account = await Account.findByPk(accountId);
        const res = await chatService.receiveMessage(account, {
          id: '1ff6f250-e8c9-46e3-bfff-0249f1eec6b8',
          from: patient.mobilePhoneNumber,
          to: clinicPhone,
          body: 'C can I say Yes?',
        });

        expect(res.body).toBe('Practice is currently closed, the next opening time is at 07:30am.');
      });

      it('Doesn\'t reply when its within the buffer limit', async () => {
        const mockedDate = setDateToTimezone('2018-10-29 07:10', 'America/Vancouver');
        jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.toDate().getTime());

        sendSMS.mockResolvedValue({ id: '16045555559' });
        const account = await Account.findByPk(accountId);
        const res = await chatService.receiveMessage(account, {
          id: '1ff6f250-e8c9-46e3-bfff-0249f1eec6b9',
          from: patient.mobilePhoneNumber,
          to: clinicPhone,
          body: 'C can I say Yes?',
        });

        expect(res).toBe(false);
      });

      it('Confirm without extra text', async () => {
        const mockedDate = setDateToTimezone('2018-10-29 07:12', 'America/Vancouver');
        jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.toDate().getTime());

        sendSMS.mockResolvedValue({ id: '16045555507' });
        const account = await Account.findByPk(accountId);
        const res = await chatService.receiveMessage(account, {
          id: '3ff6f250-e8c9-46e3-bfff-0249f1eec6b8',
          from: patient.mobilePhoneNumber,
          to: clinicPhone,
          body: 'C',
        });

        expect(res).toBe(false);
      });
    });
  });

  describe('creating message', () => {
    beforeAll(() => {
      sendSMS.mockResolvedValue({ id: '16045555551' });
    });

    it('creates a new chat for message if it doesnt exist', async () => {
      const { body, userId } = textMessageTest;
      const result = await chatService.sendMessage(
        patient.mobilePhoneNumber,
        body,
        patient.accountId,
        userId,
      );
      const omitedMessage = omitProperties(result, ['id', 'user', 'chatId']);

      expect(result.id).toBeDefined();
      expect(result.chatId).toBeDefined();
      expect(omitedMessage).toMatchSnapshot();
    });

    it('uses an existing chat to insert a message into', async () => {
      await seedTestChats();
      const createChatMock = jest.spyOn(Chat, 'create');
      const { body, userId } = textMessageTest;

      const result = await chatService.sendMessage(
        patient.mobilePhoneNumber,
        body,
        patient.accountId,
        userId,
      );
      const omitedMessage = omitProperties(result, ['id', 'user', 'chatId']);

      expect(createChatMock).not.toHaveBeenCalled();
      expect(result.id).toBeDefined();
      expect(result.chatId).toBeDefined();
      expect(omitedMessage).toMatchSnapshot();
    });
  });

  describe('message marking', () => {
    beforeAll(async () => {
      await seedTestChats();
    });

    it('marks message as unread', async () => {
      const date = '2017-07-20T00:14:30.932Z';

      const result = await chatService.markMessagesAsUnread(seededChatId, date, patientPhoneNumber);
      const data = getModelsArray('textMessages', result);
      const omitedMessage = omitPropertiesFromArray(data, ['id', 'user', 'chatId']);
      const chat = await Chat.findByPk(seededChatId);

      expect(chat.get('hasUnread')).toBe(true);
      expect(omitedMessage).toMatchSnapshot();
    });

    it('marks message as read', async () => {
      await seedTestChats();

      const result = await chatService.markMessagesAsRead(seededChatId);
      const data = getModelsArray('textMessages', result);
      const omitedMessage = omitPropertiesFromArray(data, ['id', 'user', 'chatId']);
      const chat = await Chat.findByPk(seededChatId);

      expect(chat.get('hasUnread')).toBe(false);
      expect(omitedMessage).toMatchSnapshot();
    });
  });
});
