
import { Appointment } from '../../server/_models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';
import { practitionerId, seedTestPractitioners, wipeTestPractitioners } from './seedTestPractitioners';
import { patientId, seedTestPatients, wipeTestPatients } from './seedTestPatients';

const appointmentId = '6b215a42-5c33-4f94-8313-d89893ae2f36';
const appointment = {
  id: appointmentId,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  accountId,
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestAppointments() {
  await seedTestPractitioners();
  await seedTestPatients();
  await wipeModel(Appointment);
  await Appointment.create(appointment);
}

async function wipeTestAppointments() {
  await wipeModel(Appointment);
  await wipeTestPatients();
  await wipeTestPractitioners;
}

module.exports = {
  appointment,
  appointmentId,
  seedTestAppointments,
  wipeTestAppointments,
};
