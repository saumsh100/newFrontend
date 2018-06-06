
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { Patient, Appointment, Family, SentReminder } from '../../_models';

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
    }).filter(p => p.family.id === null || p.pmsId === p.family.headId); // Remove non-family heads

    return await generateInsights(patients, startDate);
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

    while (i < patients.length && patient.id === patients[i].id) {
      const data = familyRecare(patient.id, patients[i].family);

      if (data) {
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

    insightsList.push({
      appointmentId: appointment.id,
      patientId: patient.id,
      insights,
    });

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
  const confirmAttempts = await checkConfirmAttempts(appointment.id);

  confirmAttempts.phoneNumber = patient.homePhoneNumber
    || patient.workPhoneNumber
    || patient.mobilePhoneNumber;

  return confirmAttempts.phoneNumber && moment(startDate).isAfter(new Date()) ? {
    type: 'confirmAttempts',
    value: confirmAttempts,
  } : null;
}

/**
 * [familyRecare returns a recare date for family members who are past due. ]
 * @param  {[uuid]} patientId [patientId or array of patientIds ]
 * @param  {[object]} family
 * @return {[object]} [patient Model with recareDate]
 */
function familyRecare(patientId, family) {
  if (family.id === null || family.patients.id === null
    || family.patients.id === patientId) {
    return null;
  }

  const patient = family.patients;
  if (patient.dueForHygieneDate < patient.dueForRecallExamDate || !patient.dueForRecallExamDate) {
    patient.dateDue = patient.dueForHygieneDate;
  } else {
    patient.dateDue = patient.dueForRecallExamDate;
  }

  return patient;
}

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
      appointmentId,
      isConfirmed: false,
      isConfirmable: true,
      isSent: true,
    },
  });

  for (let i = 0; i < sentReminders.length; i += 1) {
    const sentReminder = sentReminders[i];
    confirmAttempts[sentReminder.primaryType] += 1;
  }

  return confirmAttempts;
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
      isCancelled: false,
      isPending: false,
      isDeleted: false,
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
    include: [{
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
      attributes: [
        'id',
        'dueForRecallExamDate',
        'dueForHygieneDate',
        'firstName',
        'lastName'],
    }],
    required: false,
    attributes: ['id', 'headId'],
  };
}

