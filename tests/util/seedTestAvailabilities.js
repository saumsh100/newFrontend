
import { Account, Appointment, Practitioner, Patient, Enterprise, WeeklySchedule, Service, PractitionerRecurringTimeOff, Practitioner_Service, Chair } from '../../server/models';
import { Account as _Account,
  Practitioner as _Practitioner,
  WeeklySchedule as _WeeklySchedule,
  Enterprise as _Enterprise,
  Service as _Service,
  Practitioner_Service as PractitionerService,
  Chair as _Chair,
  Patient as _Patient,
  Appointment as _Appointment,
  PractitionerRecurringTimeOff as _PractitionerRecurringTimeOff,
} from '../../server/_models';
import wipeModel, { wipeModelSequelize } from './wipeModel';
import { time } from '../../server/util/time';
import moment from 'moment';

const uuid = require('uuid').v4;

const oneHour = 1 * 60 * 60;

const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';
const accountId2 = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const timeOffId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

const justinUserId = uuid();
const grantUserId = uuid();
const markUserId = uuid();
const alexUserId = uuid();
const sergeyUserId = uuid();
const jdUserId = uuid();
const syncUserId = uuid();
const vstUserId = uuid();

const enterpriseId = uuid();
const markPermissionId = uuid();
const grantPermissionId = uuid();

const alexPatientId = uuid();
const alexPatientId2 = uuid();
const markPatientId = uuid();
const justinPatientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const recallPatientId = '4fcab035-b72c-4f7a-ad73-09465cbf5654';
const sergeyPatientId = '0b59a171-889e-4631-b392-cc422f711db1';
const jdPatientId = uuid();

const justinFamilyId = '50271221-c5ee-46b3-baf5-95df3acaa6e7';

const practitionerId = uuid();
const practitionerId2 = uuid();
const practitionerId3 = uuid();
const practitionerId4 = '4f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId5 = '5f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId6 = '6f439ff8-c55d-4423-9316-a41240c4d329';

const chairId = '7f439ff8-c55d-4423-9316-a41240c4d329';
const chairId2 = uuid();
const chairId3 = '2f439ff8-c55d-4423-9316-a41240c4d329';

const serviceId = uuid();
const serviceId2 = uuid();
const serviceId3 = uuid();
const fillServiceId = 'e18bd613-c76b-4a9a-a1df-850c867b2cab';
const funServiceId = 'ac286d7e-cb62-4ea1-8425-fc7e22195692';
const crazyServiceId = '49ddcf57-9202-41b9-bc65-bb3359bebd83';
const cleanupServiceId = '5f439ff8-c55d-4423-9316-a41240c4d329';

const appointmentId1 = uuid();
const appointmentId2 = uuid();
const jdAppointmentId = uuid();

const alexChatId = uuid();
const markChatId = uuid();
const justinChatId = uuid();
const sergeyChatId = uuid();

const weeklyScheduleId = uuid();
const weeklyScheduleId2 = uuid();
const weeklyScheduleId3 = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const weeklyScheduleId4 = '39b9ed42-b82b-4fb5-be5e-9dfded032bdf';

const hour8 = new Date(1970, 1, 1, 8, 0);
const hour5 = new Date(1970, 1, 1, 17, 0);

const justinPhoneNumber = '+17808508886';
const sergeyPhoneNumber = '+16042657486';
const alexPhoneNumber = '+19782521845';
const markPhoneNumber = '+17788654451';
const jdPhoneNumber = '+16048076210';

const clinicPhoneNumber = '+17786558613';
const reminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';
const recallId = uuid();

const appointmentId = '6b215a42-5c33-4f94-8313-d89893ae2f36';

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

const donnaServices = generateDefaultServices(accountId);
const sunshineServices = generateDefaultServices(accountId2);

const Accounts = [
  {
    id: accountId2,
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
  },
]

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
    isSyncedWithPMS: false,
  }
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
    // weeklyScheduleId: weeklyScheduleId3,
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
  await Appointment.save(Appointments);
  await Account.save(Accounts);
  await Enterprise.save(Enterprises);
  await WeeklySchedule.save(WeeklySchedules);
  await Practitioner.save(Practitioners);
  await Patient.save(Patients);
  await Service.save(Services);
  await PractitionerRecurringTimeOff.save(PractitionerTimeOffs);
  await Practitioner_Service.save(Practitioner_Services);
  await Chair.save(Chairs);
}

async function seedTestAvailabilitiesSequelize() {
  await wipeModelSequelize(_Appointment);
  await wipeModelSequelize(_Chair);
  await wipeModelSequelize(_Account);
  await wipeModelSequelize(_PractitionerRecurringTimeOff);
  await wipeModelSequelize(_Practitioner);
  await wipeModelSequelize(_WeeklySchedule);
  await wipeModelSequelize(_Enterprise);
  await wipeModelSequelize(_Service);
  await wipeModelSequelize(PractitionerService);
  await wipeModelSequelize(_Patient);


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

  await _Enterprise.bulkCreate(Enterprises);
  await _WeeklySchedule.bulkCreate(newWeeklySchedules);
  await _Account.bulkCreate(Accounts);
  await _Practitioner.bulkCreate(Practitioners);
  await _Service.bulkCreate(Services);
  await PractitionerService.bulkCreate(PractitionerServices);
  await _PractitionerRecurringTimeOff.bulkCreate(PractitionerTimeOffs);
  await _Chair.bulkCreate(Chairs);
  await _Patient.bulkCreate(Patients);
  await _Appointment.bulkCreate(Appointments);
}

async function wipeTestAvailabilities() {
  await wipeModelSequelize(_Appointment);
  await wipeModelSequelize(_Chair);
  await wipeModelSequelize(_Account);
  await wipeModelSequelize(_PractitionerRecurringTimeOff);
  await wipeModelSequelize(_Practitioner);
  await wipeModelSequelize(_WeeklySchedule);
  await wipeModelSequelize(_Enterprise);
  await wipeModelSequelize(_Service);
  await wipeModelSequelize(PractitionerService);
}

module.exports = {
  seedTestAvailabilities,
  seedTestAvailabilitiesSequelize,
  wipeTestAvailabilities,
};
