
import moment from 'moment';
import {
  Account,
  Address,
  Appointment,
  Practitioner,
  WeeklySchedule,
  Enterprise,
  Service,
  Practitioner_Service,
  Chair,
  Patient,
  PatientUser,
  PractitionerRecurringTimeOff,
} from '../../server/_models';
import wipeModel, { wipeAllModels } from './wipeModel';
import { time } from '../../server/util/time';

const uuid = require('uuid').v4;

const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';
const accountId2 = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const addressId = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';

const timeOffId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

const enterpriseId = uuid();

const justinPatientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const justinPatientUserId = '6beab035-b72c-4f7a-ad73-09465cbf5654';

const practitionerId3 = '721fb9c1-1195-463f-9137-42c52d0707ab';
const practitionerId4 = '4f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId5 = '7f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId6 = '6f439ff8-c55d-4423-9316-a41240c4d329';

const chairId3 = '2f439ff8-c55d-4423-9316-a41240c4d329';

const serviceId = uuid();
const serviceId2 = uuid();
const fillServiceId = 'e18bd613-c76b-4a9a-a1df-850c867b2cab';
const funServiceId = 'ac286d7e-cb62-4ea1-8425-fc7e22195692';
const crazyServiceId = '49ddcf57-9202-41b9-bc65-bb3359bebd83';
const cleanupServiceId = '5f439ff8-c55d-4423-9316-a41240c4d329';

const weeklyScheduleId3 = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const weeklyScheduleId4 = '39b9ed42-b82b-4fb5-be5e-9dfded032bdf';

const justinPhoneNumber = '+17808508886';

const clinicPhoneNumber = '+17786558613';

const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const generateDefaultServices = (_accountId) => {
  const createService = serviceData => Object.assign({}, {
    id: uuid(),
    accountId: _accountId,
  }, serviceData);

  let first = createService({
    name: 'New Patient Consultation',
    duration: 30,
  });

  let second = createService({
    name: 'Toothache',
    duration: 30,
  });

  if (_accountId === accountId) {
    first = {
      id: serviceId,
      accountId: _accountId,
      name: 'New Patient Consultation',
      duration: 30,
    };

    second = {
      id: serviceId2,
      accountId: _accountId,
      name: 'Toothache',
      duration: 30,
    };
  }

  return [
    first,
    second,
    createService({
      name: 'Lost Filling',
      duration: 30,
    }),

    createService({
      name: 'Emergency Appointment',
      duration: 30,
    }),

    createService({
      name: 'Regular Checkup & Cleaning',
      duration: 30,
    }),

    createService({
      name: 'Regular Consultation',
      duration: 30,
    }),

    createService({
      name: 'Child Dental Exam',
      duration: 30,
    }),
  ];
};

const generatePracServJoin = (services, _practitionerId) => {
  return services.map((service) => {
    return {
      Service_id: service.id,
      Practitioner_id: _practitionerId,
      id: `${_practitionerId}_${service.id}`,
    };
  });
};

const sunshineServices = generateDefaultServices(accountId2);

const Accounts = [
  {
    id: accountId2,
    addressId,
    weeklyScheduleId: weeklyScheduleId3,
    name: 'Sunshine Smiles Dental',
    street: '10405 King St.',
    country: 'CA',
    state: 'ON',
    city: 'Toronto',
    zipCode: '90210',
    twilioPhoneNumber: clinicPhoneNumber,
    enterpriseId,
    canSendReminders: true,
    canSendRecalls: true,
    timezone: 'America/Vancouver',
    timeInterval: 30,
  },
];

const Appointments = [
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 3, 8, 0),
    endDate: new Date(2017, 3, 3, 9, 0),
    serviceId: cleanupServiceId,
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 3, 9, 0),
    endDate: new Date(2017, 3, 3, 10, 0),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: cleanupServiceId,
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 3, 10, 0),
    endDate: new Date(2017, 3, 3, 11, 0),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: cleanupServiceId,
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 3, 13, 0),
    endDate: new Date(2017, 3, 3, 13, 21),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: cleanupServiceId,
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 3, 14, 30),
    endDate: new Date(2017, 3, 3, 15, 21),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: cleanupServiceId,
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 10, 13, 0),
    endDate: new Date(2017, 3, 10, 13, 40),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: funServiceId,
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 10, 14, 30),
    endDate: new Date(2017, 3, 10, 15, 10),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: funServiceId,
    patientId: justinPatientId,
  },
  {
    accountId: accountId2,
    practitionerId: practitionerId4,
    startDate: new Date(2017, 3, 17, 13, 0),
    endDate: new Date(2017, 3, 17, 14, 10),
    chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
    serviceId: crazyServiceId,
    patientId: justinPatientId,
  },
];

const Patients = [
  {
    id: justinPatientId,
    accountId: accountId2,
    firstName: 'Justin',
    lastName: 'Sharp',
    email: 'justin@carecru.com',
    mobilePhoneNumber: justinPhoneNumber,
    birthDate: moment({year: 1993, month: 6, day: 15})._d,
    gender: 'male',
    language: 'English',
    lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
    status: 'Active',
    insurance: {
      insurance: 'GMC Health Insurance',
      memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
      contract: '4234rerwefsdfsd',
      carrier: 'sadasadsadsads',
      sin: 'dsasdasdasdadsasad',
    },
    isSyncedWithPms: false,
  },
];

const PatientUsers = [
  {
    id: justinPatientUserId,
    firstName: 'Justin',
    lastName: 'Sharp',
    email: 'justin@carecru.com',
  },
];

const Enterprises = [
  {
    id: enterpriseId,
    name: 'Diamond Smile Organization',
    plan: 'ENTERPRISE',
  },
];

const Practitioners = [
  {
    id: practitionerId3,
    accountId: accountId2,
    firstName: 'Jennifer',
    lastName: 'Love-Hewitt',
    isCustomSchedule: false,
    // services: [],
  },
  {
    id: practitionerId5,
    accountId: accountId2,
    firstName: 'Will',
    lastName: 'Ferrel',
    isCustomSchedule: false,
    // services: [],
  },
  {
    id: practitionerId6,
    accountId: accountId2,
    firstName: 'Joe',
    lastName: 'Montana',
    isCustomSchedule: false,
    // services: [],
  },
  {
    id: practitionerId4,
    accountId: accountId2,
    firstName: 'Chelsea',
    lastName: 'Handler',
    weeklyScheduleId: weeklyScheduleId4,
    isCustomSchedule: true,
    // services: [],
  },
];

const WeeklySchedules = [
  {
    id: weeklyScheduleId3,
    accountId: accountId2,
    wednesday: {
      isClosed: true,
    },

    saturday: {
      isClosed: true,
    },

    sunday: {
      isClosed: true,
    },
  },
  {
    id: weeklyScheduleId4,
    accountId: accountId2,
    monday: {
      startTime: time(8, 0),
      endTime: time(17, 0),
      breaks: [
        {
          startTime: time(12, 0),
          endTime: time(13, 0),
        },
      ],
      chairIds: ['2f439ff8-c55d-4423-9316-a41240c4d329'],
    },

    tuesday: {
      chairIds: ['2f439ff8-c55d-4423-9316-a41240c4d329'],
    },

    wednesday: {
      isClosed: true,
      chairIds: ['2f439ff8-c55d-4423-9316-a41240c4d329'],
    },

    friday: {
      isClosed: true,
      chairIds: ['2f439ff8-c55d-4423-9316-a41240c4d329'],
    },

    saturday: {
      isClosed: true,
      chairIds: ['2f439ff8-c55d-4423-9316-a41240c4d329'],
    },

    sunday: {
      isClosed: true,
      chairIds: ['2f439ff8-c55d-4423-9316-a41240c4d329'],
    },

    startDate: new Date(2017, 4, 5, 9, 0),
    weeklySchedules: [{
      sunday: {
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [
          {
            startTime: time(12, 0),
            endTime: time(13, 0),
          },
        ],
      },

      tuesday: {
        isClosed: true,
      },

      thursday: {
        isClosed: true,
      },

      wednesday: {
        isClosed: true,
      },

      friday: {
        isClosed: true,
      },

      saturday: {
        isClosed: true,
      },

      monday: {
        isClosed: true,
      },
    }],

    isAdvanced: true,
  },
];

const Services = [
  {
    id: cleanupServiceId,
    accountId: accountId2,
    name: 'Cleanup',
    duration: 60,
    bufferTime: 0,
    unitCost: 40,
  },
  {
    id: fillServiceId,
    accountId: accountId2,
    name: 'Fill',
    duration: 21,
    bufferTime: 0,
    unitCost: 40,
  },
  {
    id: funServiceId,
    accountId: accountId2,
    name: 'Fun',
    duration: 40,
    bufferTime: 0,
    unitCost: 40,
  },
  {
    id: crazyServiceId,
    accountId: accountId2,
    name: 'Crazy',
    duration: 70,
    bufferTime: 0,
    unitCost: 40,
  },
  ...sunshineServices,
];

const PractitionerTimeOffs = [
    // For tests!
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 2, 19, 0, 0), // sunday (2 days)
    endDate: new Date(2017, 2, 20, 23, 59), // monday
  },
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 2, 22, 0, 0), // wednesday (1 day)
    endDate: new Date(2017, 2, 22, 23, 59), // wednesday
  },
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 2, 24, 0, 0), // friday (3 days)
    endDate: new Date(2017, 2, 26, 23, 59), // sunday
  },
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 2, 28, 0, 0), // tuesday (1 day)
    endDate: new Date(2017, 2, 28, 23, 59), // tuesday
  },
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 1, 27, 0, 0),
    endDate: new Date(2017, 1, 27, 0, 0),
  },
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 2, 7, 8, 0),
    endDate: new Date(2017, 2, 7, 12, 0),
    allDay: false,
  },
  {
    practitionerId: practitionerId4,
    startDate: new Date(2017, 2, 7, 16, 0),
    endDate: new Date(2017, 2, 7, 17, 0),
    allDay: false,
  },
  {
    id: timeOffId,
    practitionerId: practitionerId4,
    startDate: new Date(2011, 2, 7, 16, 0),
    endDate: new Date(2011, 2, 7, 17, 0),
    startTime: time(12, 0).toISOString(),
    endTime: time(13, 0).toISOString(),
    dayOfWeek: 'Sunday',
    interval: 1,
    allDay: false,
  },
];

const Practitioner_Services = [
  // Availabilities Test
  {
    Practitioner_id: practitionerId3,
    Service_id: cleanupServiceId,
  },
  {
    Practitioner_id: practitionerId4,
    Service_id: cleanupServiceId,
  },
  {
    Practitioner_id: practitionerId4,
    Service_id: fillServiceId,
  },
  {
    Practitioner_id: practitionerId4,
    Service_id: funServiceId,
  },
  {
    Practitioner_id: practitionerId4,
    Service_id: crazyServiceId,
  },

  ...generatePracServJoin(sunshineServices, practitionerId3),
  ...generatePracServJoin(sunshineServices, practitionerId4),
  ...generatePracServJoin(sunshineServices, practitionerId5),
  ...generatePracServJoin(sunshineServices, practitionerId6),
];

const Chairs = [
  {
    accountId: accountId2,
    name: 'Chair 2',
    description: '',
  },
  {
    id: chairId3,
    accountId: accountId2,
    name: 'Chair 1',
    description: '',
  },
];

async function seedTestAvailabilities() {
  await wipeAllModels();

  const newWeeklySchedules = WeeklySchedules.map((weeklySchedule) => {
    delete weeklySchedule.accountId;
    return weeklySchedule;
  });

  const PractitionerServices = Practitioner_Services.map((pracService) => {
    return {
      practitionerId: pracService.Practitioner_id,
      serviceId: pracService.Service_id,
    };
  });

  await Enterprise.bulkCreate(Enterprises);
  await WeeklySchedule.bulkCreate(newWeeklySchedules);
  await Address.bulkCreate([address]);
  await Account.bulkCreate(Accounts);
  await Practitioner.bulkCreate(Practitioners);
  await Service.bulkCreate(Services);
  await Practitioner_Service.bulkCreate(PractitionerServices);
  await PractitionerRecurringTimeOff.bulkCreate(PractitionerTimeOffs);
  await Chair.bulkCreate(Chairs);
  await Patient.bulkCreate(Patients);
  await PatientUser.bulkCreate(PatientUsers);
  await Appointment.bulkCreate(Appointments);
}

async function wipeTestAvailabilities() {
  await wipeAllModels();
}

module.exports = {
  seedTestAvailabilities,
  wipeTestAvailabilities,
};
