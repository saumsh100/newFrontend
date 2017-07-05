
import isUndefined from 'lodash/isUndefined';
import { r } from '../server/config/thinky';
import { Appointment, Patient } from '../server/models';

async function up() {
  try {
    console.log('Fetching all patients...');

    let patients = await Patient.filter(p => p.hasFields('isBatch').not()).run();

    console.log(`${patients.length} patients fetched.`);
    console.log(`Updating those patients...`);

    let i = 0;
    for (const patient of patients) {
      try {
        console.log(`${i++}`);
        await patient.save();
      } catch (err) {
        console.error('patient did not sucessfully update');
        console.error(err);
        console.log(patient);
      }
    }

    console.log(`Those patients are updated.`);

    console.log('Fetching all appointments...');

    let appointments = await Appointment.filter(a => a.hasFields('isBatch').not()).run();

    console.log(`${appointments.length} appointments fetched.`);
    console.log(`Updating those appointments...`);

    i = 0;
    for (const appointment of appointments) {
      try {
        console.log(`${i++}`);
        await appointment.save();
      } catch (err) {
        console.error('appointment did not sucessfully update');
        console.error(err);
        console.log(appointment);
      }
    }

    console.log(`Those appointments are updated.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

up();
