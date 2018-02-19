
import moment from 'moment';
import { Account, Patient } from '../../server/_models/index';
import * as avatarUrls from './demoAvatarUrls';

const { ACCOUNT_ID } = process.env;

async function main({ accountId }) {
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      throw new Error('Must supply a valid ACCOUNT_ID to this script or else I don\'t know where you want this data to go!');
    }

    // Add avatarURL to Patients
    const patients = await Patient.unscoped().findAll({ where: { accountId: account.id } });
    console.log(`${patients.length} patients fetched for update...`);
    let i = 0;
    for (const patient of patients) {
      const { gender, birthDate } = patient;
      const lowerGender = (gender || 'male').toLowerCase();
      const age = birthDate ? moment().diff(birthDate, 'years') : 0;
      await patient.update({ avatarUrl: avatarUrls[lowerGender][age] });
      if ((i++ % 50) === 0) {
        console.log(`${i} updated`);
      }
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main({ accountId: ACCOUNT_ID });
