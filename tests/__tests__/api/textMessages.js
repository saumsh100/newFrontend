
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Chat, TextMessage } from '../../../server/models';
import wipeModel from '../../util/wipeModel';
import { accountId, managerUserId, seedTestUsers } from '../../util/seedTestUsers';
import { patientId, seedTestPatients } from '../../util/seedTestPatients';

const chatId = 'bca11507-4fca-4134-8ffe-e925b76e294e';
const textMessageId = 'ef6e0183-6173-494f-9937-1327edfa3b4e';

const chat = {
  id: chatId,
  accountId,
  patientId,
  patientPhoneNumber: '6049999999',
  createdAt: '2017-07-19T00:14:30.932Z',
};
const textMessage = {
  id: textMessageId,
  chatId,
  userId: managerUserId,

  to: '6049999999',
  from: '604777777',
  body: 'Test Text Message',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestChat() {
  await seedTestPatients();
  await wipeModel(Chat);
  await wipeModel(TextMessage);
  await Chat.save(chat);
  await TextMessage.save(textMessage);
};

describe('/api/textMessages', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestChat();
    });

    test('retrieve text messages', () => {
      return request(app)
        .get(`/api/textMessages?patientId=${patientId}&offset=0`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: This one is a little iffy...
    test('/twilio - retrieve twilio messages', () => {
      return request(app)
        .get('/api/textMessages/twilio')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });

    test('/conversations - retrieve conversations', () => {
      return request(app)
        .get('/api/textMessages/conversations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: don't quite understand this endpoint
    /*
    test.only('/dialogs - retrieve dialogs', () => {
      return request(app)
        .get('/api/textMessages/dialogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          token: {
            activeAccountId: accountId,
          },
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
          console.log(JSON.stringify(body));
        });
    });
    */
  });
});
