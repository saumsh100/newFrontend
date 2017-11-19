
import groupBy from 'lodash/groupBy';
import some from 'lodash/some';
import moment from 'moment';
import {
  Appointment,
  DeliveredProcedure,
  Patient,
} from '../server/_models';

/*
  - grab all appointments for account and loop through
  - grab deliveredProcedures in same day as the appointment
  -

 */


/*
  Questions:
  - What percentage of appointments are on the same day?
    - meaning it would be impossible to tie the correct procedures to those


 */

async function countPatientsWithSameDayAppointments() {
  try {
    console.log('Fetching...');
    const patients = await Patient.findAll({
      where: { accountId: '02d0334e-4e56-433b-aed0-e9f5d1590ef3' }  ,
      include: [
        {
          model: Appointment,
          as: 'appointments',
          required: true,
          where: {
            isCancelled: false,
            isDeleted: false,
            isPending: false,
          },
        },
      ],
    });

    let count = 0;
    console.log(`Fetched ${patients.length} patients`);
    for (const patient of patients) {
      const groupedAppointments = groupBy(patient.appointments, (a) => {
        return moment(a.startDate).startOf('day').format();
      });

      const hasSameDayAppts = some(groupedAppointments, group => group.length > 1);
      if (hasSameDayAppts) {
        count++;
      }
    }

    console.log(`${count} patients have appointments in same day`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}


countPatientsWithSameDayAppointments();

