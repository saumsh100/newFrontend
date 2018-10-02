
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { Patient, Appointment, Family, SentReminder, SentRemindersPatients } from 'CareCruModels';
import Appointments from '../../../client/entities/models/Appointments';

/**
 * [allInsights returns insights for all patients who are the head
 * of the family (or have no family). This includes having an appointment
 * on the selected startDate and could include family members who are past due for a recare exam]
 * @param  {String} accountId
 * @param {Date} startDate
 * @Param {Date} endDate
 * @return [Array] insights [formatted insights]
 */
export async function allInsights(accountId, startDate, endDate) {
  try {
    const patients = await Patient.findAll({
      where: {
        accountId,
        $or: [
          {
            birthDate: {
              $eq: null,
            },
          },
          {
            birthDate: {
              $lte: moment().subtract(16, 'years'),
            },
          },
        ],
      },
      include: [
        appointmentsQuery(accountId, startDate, endDate),
        familyQuery(accountId, startDate),
      ],
      raw: true,
      nest: true,
      attributes: [
        'Patient.id',
        'Patient.pmsId',
        'Patient.firstName',
        'Patient.lastName',
        'Patient.mobilePhoneNumber',
        'Patient.workPhoneNumber',
        'Patient.homePhoneNumber',
        'Patient.email',
        'Patient.familyId',
      ],
    });

    const familyHeads = patients.filter(p => p.family.id === null || p.id === p.family.headId);

    return await generateInsights(familyHeads, startDate);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * [generateInsights calculates if a patient has a missing phone-number, email,
 * or if any of their family members are past due for a recare exam]
 * @param  {Array} patients [Array of patient models with appointments and family members]
 * @param  {Date} startDate [Selected date]
 * @return [Array] insights [formatted insights]
 */
async function generateInsights(patients, startDate) {
  const insightsList = [];
  let j = 0;

  while (j < patients.length) {
    const patient = patients[j];
    const insights = [];
    const appointment = patient.appointments;

    if (!patient.mobilePhoneNumber) {
      insights.push(generatePhoneNumberInsight());
    }

    if (!patient.email) {
      insights.push(generateEmailInsight());
    }

    if (!appointment.isPatientConfirmed) {
      const confirmInsight = await generateConfirmApptInsight(patient, appointment, startDate);
      if (confirmInsight) {
        insights.push(confirmInsight);
      }
    }

    let i = j;
    const familiesDueRecare = [];
    let familyId = null;

    while (i < patients.length && patient.id === patients[i].id) {
      const data = familyRecare(patient.id, patients[i].family, familyId);

      if (data) {
        familyId = data.id;
        familiesDueRecare.push(data);
      }
      i += 1;
    }

    if (familiesDueRecare[0]) {
      insights.push({
        type: 'familiesDueRecare',
        value: familiesDueRecare,
      });
    }

    if (insights.length) {
      insightsList.push({
        appointmentId: appointment.id,
        patientId: patient.id,
        insights,
      });
    }
    j = i;
  }

  return uniqBy(insightsList, 'patientId');
}

/**
 * [generatePhoneNumberInsight returns a formatted insight for patients who have a missing
 * mobile phone number]
 * @return [Object] Missing Phone Number insight
 */
function generatePhoneNumberInsight() {
  return {
    type: 'missingMobilePhone',
    value: null,
  };
}

/**
 * [generateEmailInsight returns a formatted insight for patients who have a missing
 * email]
 * @return [Object] Missing Email insight
 */
function generateEmailInsight() {
  return {
    type: 'missingEmail',
    value: null,
  };
}

/**
 * [generateConfirmApptInsight returns a formatted insight for patients who have not
 * confirmed their appointment. Only generates insight for future dates]
 * @param  {Object} patient
 * @param  {Object} appointment
 * @param  {Date} startDate [Selected date]
 * @return [Object] Confirm Appointment Insight
 */
async function generateConfirmApptInsight(patient, appointment, startDate) {
  const phoneNumber =
    patient.mobilePhoneNumber || patient.workPhoneNumber || patient.homePhoneNumber;

  const confirmAttempts =
    patient.mobilePhoneNumber && patient.email && (await checkConfirmAttempts(appointment.id));

  if (confirmAttempts) {
    confirmAttempts.phoneNumber = phoneNumber;
  }

  return (
    moment(startDate).isAfter(new Date()) &&
    (phoneNumber || patient.email) && {
      type: 'confirmAttempts',
      value: confirmAttempts || { phoneNumber },
    }
  );
}

/**
 * [familyRecare returns a recare date for family members who are past due. ]
 * @param  {[uuid]} patientId [patientId or array of patientIds ]
 * @param  {[object]} family
 * @param  {[string]} familyMemberId [previous family member id]
 * @return {[object]} [patient Model with recareDate]
 */
function familyRecare(patientId, family, familyMemberId) {
  if (
    family.id === null ||
    family.patients.id === null ||
    family.patients.id === patientId ||
    familyMemberId === family.patients.id
  ) {
    return null;
  }

  const patient = family.patients;

  const { dueForHygieneDate, dueForRecallExamDate } = patient;

  if (!dueForHygieneDate && !dueForRecallExamDate) {
    return null;
  }

  if (dueForHygieneDate && dueForRecallExamDate) {
    patient.dateDue = comparePatientDateDue(dueForHygieneDate, dueForRecallExamDate);
  } else if (!dueForRecallExamDate) {
    patient.dateDue = dueForHygieneDate;
  } else {
    patient.dateDue = dueForRecallExamDate;
  }

  return patient;
}

/**
 * compares a patients due dates for hygiene and recall exams.
 */
const comparePatientDateDue = (dueForHygieneDate, dueForRecallExamDate) =>
  (dueForHygieneDate < dueForRecallExamDate ? dueForHygieneDate : dueForRecallExamDate);

/**
 * [checkConfirmAttempts checks how many attempts CareCru tried for a Appointment Confirmation]
 * @param  {[uuid]} appointmentId
 * @return {[object]} [object with a tally of email, sms, and phone]
 */
export async function checkConfirmAttempts(appointmentId) {
  const confirmAttempts = {
    email: 0,
    sms: 0,
    phone: 0,
  };

  const sentReminders = await SentReminder.findAll({
    where: {
      isConfirmed: false,
      isConfirmable: true,
      isSent: true,
    },
    include: [
      {
        model: SentRemindersPatients,
        as: 'sentRemindersPatients',
        required: true,
        where: { appointmentId },
      },
    ],
  });

  if (!sentReminders.length) {
    return null;
  }

  sentReminders.forEach((sentReminder) => {
    confirmAttempts[sentReminder.primaryType] += 1;
  });

  let approveInsight = false;
  Object.keys(confirmAttempts).forEach((primaryType) => {
    if (confirmAttempts[primaryType] > 0) {
      approveInsight = true;
    }
  });

  return approveInsight && confirmAttempts;
}

function appointmentsQuery(accountId, startDate, endDate) {
  return {
    model: Appointment,
    as: 'appointments',
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },
      ...Appointments.getCommonSearchAppointmentSchema(),
    },
    order: [['startDate', 'DESC']],
    attributes: ['id', 'isPatientConfirmed', 'patientId'],
    required: true,
  };
}

function familyQuery(accountId, startDate) {
  return {
    model: Family,
    as: 'family',
    where: {
      accountId,
    },
    include: [
      {
        model: Patient,
        as: 'patients',
        where: {
          accountId,
          $or: {
            dueForHygieneDate: {
              $lt: new Date(startDate).toISOString(),
              $ne: null,
            },
            dueForRecallExamDate: {
              $lt: new Date(startDate).toISOString(),
              $ne: null,
            },
          },
          nextApptDate: null,
          status: 'Active',
        },
        required: false,
        attributes: ['id', 'dueForRecallExamDate', 'dueForHygieneDate', 'firstName', 'lastName'],
      },
    ],
    required: false,
    attributes: ['id', 'headId'],
  };
}
