
import moment from 'moment';
import _ from 'lodash';
import { Appointment, Request } from '../server/_models';

const { ACCOUNT_ID, START_DATE, END_DATE } = process.env;

async function calculateAverageAppointmentsPerPatient(accountId, startDate, endDate) {
  const appointments = await Appointment.findAll({
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },

      isCancelled: false,
      isDeleted: false,

      $not: [
        { patientId: null },
      ],
    },

    // TODO: for some reason this does not work, it complains about "patientid" column not existing
    // group: 'patientId',
  });

  const numAppointments = appointments.length;
  const groupedByPatient = _.groupBy(appointments, 'patientId');
  const numGroups = _.size(groupedByPatient);

  console.log(`${numAppointments} appointments fetched`);
  console.log(`${numGroups} groups found`);

  return numAppointments / numGroups;
}

async function calculateBookingsViaWidget(accountId, startDate, endDate) {
  return await Request.count({
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },

      isConfirmed: true,
    },
  });
}

async function calculateNewPatientsViaWidget(accountId, startDate, endDate) {
  return await Request.count({
    raw: true,
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },

      isConfirmed: true,
    },
  });
}

async function main() {
  // Pull all Appointments in date range
  // Group Appointments by Patient
  // Summarize and Average
  try {
    console.log('Calculating...');
    const average = await calculateAverageAppointmentsPerPatient(ACCOUNT_ID, START_DATE, END_DATE);
    const totalBookings = await calculateBookingsViaWidget(ACCOUNT_ID, START_DATE, END_DATE);
    console.log(`Average Appointments per Patient = ${average}`);
    console.log(`Total Bookings via Web Widget = ${totalBookings}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
