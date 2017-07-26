
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Chat, TextMessage } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { patient, patientId, seedTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody } from '../../util/selectors';

const chatId = '3180a744-f6b0-4a09-8046-4e713bf5b565';
const textMessageId = '059987cb-3051-4656-98d0-72cda34d32a6';
const patientPhoneNumber = '+16045555555';
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
  body: 'This is a test text message',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestChats() {
  await seedTestPatients();
  await wipeModel(TextMessage);
  await wipeModel(Chat);
  await Chat.save(chat);
  await TextMessage.save(textMessage);
}

describe('/api/chats', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestChats();
    });

    test('/ - get chats', () => {
      return request(app)
        .get('/api/chats/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:chatId - retrieve chat', () => {
      return request(app)
        .get(`/api/chats/${chatId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/patient/:patientId - return chat with patient', () => {
      return request(app)
        .get(`/api/chats/patient/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:chatId/textMessages - retrieve text messages for a chat', () => {
      return request(app)
        .get(`/api/chats/${chatId}/textMessages`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(TextMessage);
      await wipeModel(Chat);
    });

    test('/ - create a chat', () => {
      return request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${token}`)
        .send({
          patient,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.chats).length).toBe(1);
        });
    });

    // TODO: Figure out how to run this without twilio
    /*
    test.only('/textMessages - create a text message', async () => {
      await seedTestChats();
      const textPatient = patient;
      textPatient.mobilePhoneNumber = '+16045555555';

      return request(app)
        .post('/api/chats/textMessages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          chatId,
          message: 'Test POST text message',
          patient: textPatient,
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          console.log(JSON.stringify(body));
          expect(Object.keys(body.entities.textMessages).length).toBe(1);
        });
    });
    */
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestChats();
    });

    test('/:_chatId/textMessages/read - set all of chats unread text messages to read', () => {
      return request(app)
        .put(`/api/chats/${chatId}/textMessages/read`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated',
        })
        .expect(200)
        .then(({ body }) => {
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
        .delete(`/api/chats/${chatId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
