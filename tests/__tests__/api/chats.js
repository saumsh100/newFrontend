
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Chat, TextMessage, Patient } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { patient, patientId, seedTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody } from '../../util/selectors';

const chatId = '3180a744-f6b0-4a09-8046-4e713bf5b565';
const textMessageId = '059987cb-3051-4656-98d0-72cda34d32a6';
const textMessageId1 = '059987cb-3051-4656-98d0-72cda34d32a1';
const patientPhoneNumber = '+16045555555';
const clinicPhone = '+16043333333';

const rootUrl = '/_api/chats';

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
  body: 'This is a test text message',
  createdAt: '2017-07-19T00:14:30.932Z',
  userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
};

const textMessage1 = {
  id: textMessageId1,
  chatId,
  to: patientPhoneNumber,
  from: clinicPhone,
  body: 'This is a test text message, latest',
  createdAt: '2017-07-20T00:14:30.932Z',
  userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
};

async function seedTestChats() {
  await wipeModel(TextMessage);
  await wipeModel(Chat);
  await wipeModel(Patient);
  await seedTestPatients();
  await Chat.create(chat);
  await TextMessage.create(textMessage);
  await TextMessage.create(textMessage1);
}

function filterObject(obj, key) {
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] === 'object') {
      filterObject(obj[i], key);
    } else if (i == key) {
      delete obj[key];
    }
  }
  return obj;
}

describe('/api/chats', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Chat)
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeAll(async () => {
      await seedTestChats();
    });

    test('/ - get chats', () => {
      return request(app)
        .get(`${rootUrl}?limit=15`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:chatId - retrieve chat', () => {
      return request(app)
        .get(`${rootUrl}/${chatId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/patient/:patientId - return chat with patient', () => {
      return request(app)
        .get(`${rootUrl}/patient/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          filterObject(body, 'updatedAt')
          body = omitPropertiesFromBody(body, ['lastTextMessageId', 'updatedAt']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:chatId/textMessages - retrieve text messages for a chat', () => {
      return request(app)
        .get(`${rootUrl}/${chatId}/textMessages`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          filterObject(body, 'updatedAt')
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:chatId/textMessages - offset and limiting returns correct messages', () => {
      return request(app)
        .get(`${rootUrl}/${chatId}/textMessages?limit=1&skip=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          filterObject(body, 'updatedAt')
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeAll(async () => {
      await wipeModel(TextMessage);
      await wipeModel(Chat);
    });

    test('/ - create a chat', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          patient,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId', 'updatedAt']);
          expect(Object.keys(body.entities.chats).length).toBe(1);
        });
    });

    // TODO: Figure out how to run this without twilio

    // test.only('/textMessages - create a text message', async () => {
    //   await seedTestChats();
    //   const textPatient = patient;
    //   textPatient.mobilePhoneNumber = '+16045555555';

    //   return request(app)
    //     .post(`${rootUrl}/textMessages`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({
    //       chatId,
    //       message: 'Test POST text message',
    //       patient: textPatient,
    //     })
    //     .expect(200)
    //     .then(({ body }) => {
    //       body = omitPropertiesFromBody(body);
    //       console.log(JSON.stringify(body));
    //       expect(Object.keys(body.entities.textMessages).length).toBe(1);
    //     });
    // });

  });

  describe('PUT /', () => {
    beforeEach(async () => {
      console.log('notdone')
      await seedTestChats();
      console.log('done')
    });

    test('/:_chatId/textMessages/read - set all of chats unread text messages to read', () => {
      return request(app)
        .put(`${rootUrl}/${chatId}/textMessages/read`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated',
        })
        .expect(200)
        .then(({ body }) => {
          filterObject(body, 'updatedAt')
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestChats();
    });

    test('/:chatId - delete chat', () => {
      return request(app)
        .delete(`${rootUrl}/${chatId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
