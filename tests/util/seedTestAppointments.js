
import { Appointment } from '../../server/models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';
import { practitionerId, seedTestPractitioners } from './seedTestPractitioners';
import { patientId, seedTestPatients } from './seedTestPatients';

const appointmentId = '6b215a42-5c33-4f94-8313-d89893ae2f36';
const appointment = {
  id: appointmentId,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  accountId,
  patientId,
  practitionerId,
  isSyncedWithPMS: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
  chairId: null,
  customBufferTime: null,
  isBookable: false,
  pmsId: null,
  serviceId: null,
};

async function seedTestAppointments() {
  await seedTestPractitioners();
  await seedTestPatients();
  await wipeModel(Appointment);
  await Appointment.save(appointment);
}

module.exports = {
  appointment,
  appointmentId,
  seedTestAppointments,
};
