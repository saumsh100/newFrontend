
import faker from 'faker';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Account, Chat, Patient, TextMessage } from '../server/_models';

// Purpose of this file is to seed Chats and TextMessages to test for infinite scroll
// and large number of textMessage rendering

const { ACCOUNT_ID } = process.env;

async function main({ accountId }) {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error('Must supply a valid ACCOUNT_ID to this script or else I don\'t know where you want this data to go!');
  }

  const patientSeeds = [];

  let i;
  let length = 100;
  for (i = 0; i < length; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const phoneNumber = faker.phone.phoneNumber('+1##########');
    patientSeeds.push({
      accountId,
      firstName,
      lastName,
      email: `${firstName}.${lastName}@google.ca`,
      mobilePhoneNumber: phoneNumber,
      birthDate: faker.date.past(40, '2010-01-01'),
      gender: 'male',
    });
  }

  console.log('Creating patients...');
  const patients = await Patient.bulkCreate(patientSeeds);

  console.log('Assigning created patientIds to chat seeds...');
  const chatSeeds = patients.map((patient) => {
    return {
      accountId,
      patientId: patient.id,
      patientPhoneNumber: patient.mobilePhoneNumber,
      isFlagged: true,
    };
  });

  console.log('Creating chats...');
  const chats = await Chat.bulkCreate(chatSeeds);

  console.log('Assigning created chatIds to textMessage seeds...');
  const startDate = moment('2010-01-01');
  let textMessageSeeds = [];
  chats.forEach((chat, j) => {
    const newSeeds = [];
    for (let i = 0; i < 100; i++) {
      startDate.add(1, 'd');
      newSeeds.push({
        id: uuid(),
        chatId: chat.id,
        body: i.toString(),
        to: patients[j].mobilePhoneNumber,
        from: account.twilioPhoneNumber,
        read: false,
        createdAt: startDate.format(),
      });
    }

    textMessageSeeds = [...textMessageSeeds, ...newSeeds];
  });

  console.log('Creating textMessages...');
  const textMessages = await TextMessage.bulkCreate(textMessageSeeds);

  console.log('Updating Chats with lastTextMessageId...');
  for (let i = 0; i < 100; i++) {
    const textMessage = textMessages[((i + 1) * 100) - 1];
    await chats[i].update({
      lastTextMessageId: textMessage.id,
      lastTextMessageDate: textMessage.createdAt,
    });
  }
}

main({
  accountId: ACCOUNT_ID,
}).then(() => {
  console.log('Complete!');
  process.exit();
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
