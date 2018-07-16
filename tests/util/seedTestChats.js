import { patientId, seedTestPatients } from './seedTestPatients';
import wipeModel from './wipeModel';
import { Chat, Patient, TextMessage } from '../../server/_models';
import { accountId } from './seedTestUsers';

export const chatId = '3180a744-f6b0-4a09-8046-4e713bf5b566';
const textMessageId = '059987cb-3051-4656-98d0-72cda34d32a8';
const textMessageIdAfter = '059987cb-3051-4656-98d0-72cda34d32a9';
export const patientPhoneNumber = '+16045555555';
const clinicPhone = '+16043333333';

const chat = {
  id: chatId,
  accountId,
  patientId,
  patientPhoneNumber,
  lastTextMessageDate: '2017-07-22T00:14:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const textMessage = {
  id: textMessageId,
  chatId,
  to: patientPhoneNumber,
  from: clinicPhone,
  read: false,
  body: 'This is a test text message',
  createdAt: '2017-07-19T00:14:30.932Z',
  userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
};

const textMessageAfter = {
  id: textMessageIdAfter,
  chatId,
  to: patientPhoneNumber,
  from: clinicPhone,
  read: true,
  body: 'This is a test text message',
  createdAt: '2017-07-21T00:14:30.932Z',
  userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
};

export async function seedTestChats() {
  await wipeModel(TextMessage);
  await wipeModel(Chat);
  await wipeModel(Patient);
  await seedTestPatients();
  await Chat.create(chat);
  await TextMessage.bulkCreate([
    textMessage,
    textMessageAfter,
  ]);
}
