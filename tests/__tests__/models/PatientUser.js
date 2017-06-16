
import { v4 as uuid } from 'uuid';
import omit from 'lodash/omit';
import PinCode from '../../../server/models/PinCode';
// import thinky from '../../../server/config/thinky';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

async function wipe() {
  const patientUsers = await PatientUser.run();

  console.log('wipe - patientUsers', patientUsers);
  for (const patientUser of patientUsers) {
    await patientUser.delete();
  }

  console.log(PatientUser.auxModels);
  for (let key in PatientUser.auxModels) {
    const auxModel = PatientUser.auxModels[key];
    if (!auxModel) break;
    const entries = await auxModel.run();
    console.log(entries);
    for (const e of entries) {
      await e.delete();
    }
  }
}

describe('models/PatientUser', () => {
  /*beforeEach(async () => {
    await wipe();
  });*/

  /**
   * - write single patient
   */
  test('should be able to save a PatientUser without id provided', async () => {
    /*const patientUser = await PatientUser.save({
      firstName: 'Justin',
      lastName: 'Sharp',
      email: 'justin@carecru.com',
      phoneNumber: '+17808508886',
      password: 'cat',
    });

    expect(patientUser instanceof PatientUser).toBe(true);*/
    const pc = await PinCode.save({
      pinCode: '8888',
      modelId: uuid(),
    });

    expect(pc.isSaved()).toBe(true);
  });

});

function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(4);
    }, 2000);
  });
}
