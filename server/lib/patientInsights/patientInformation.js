
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { sort } from '@carecru/isomorphic';
import {
  Patient,
  Appointment,
  Family,
  SentReminder,
  SentRemindersPatients,
} from 'CareCruModels';

/**
 * [allInsights returns insights for all patients who are the head
 * of the family (or have no family). This includes having an appointment
 * on the selected startDate and could include family members who are past due for a recare exam]
 * @param  {String} accountId
 * @param {Date} startDate
 * @param {Date} endDate
 * @Param {Date} endDate
 * @return [Array] insights [formatted insights]
 */
export async function allInsights(accountId, startDate, endDate) {
  try {
    const patients = await Patient.findAll({
      where: {
        accountId,
        $or: [
          { birthDate: { $eq: null } },
          { birthDate: { $lte: moment().subtract(16, 'years') } },
        ],
      },
      include: [
        appointmentsQuery(accountId, startDate, endDate),
        familyQuery(accountId, startDate),
      ],
      nest: true,
    });

    const familyHeads = patients.filter(p => p && (p.family === null || p.id === p.family.headId));
    return generateInsights(familyHeads);
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
export async function generateInsights(patients) {
  const insightsPromises = patients
    .map(p => p.get({ plain: true }))
    .map(async (patient) => {
      const insights = [];
      const appointment = patient.appointments[0];

      if (!patient.cellPhoneNumber) {
        insights.push(generatePhoneNumberInsight());
      }

      if (!patient.email) {
        insights.push(generateEmailInsight());
      }

      if (!appointment.isPatientConfirmed) {
        const confirmInsight = await generateConfirmApptInsight(
          patient,
          appointment,
        );
        if (confirmInsight) {
          insights.push(confirmInsight);
        }
      }

      if (patient.family && patient.family.patients.length > 0) {
        const filteredFamilies = patient.family.patients.filter(p => p.id !== patient.id);
        const familiesDueRecare =
          filteredFamilies.map(({ dueForHygieneDate, dueForRecallExamDate, ...p }) => ({
            ...p,
            dateDue: [dueForHygieneDate, dueForRecallExamDate]
              .filter(a => !!a)
              .sort(sort())[0],
          }));

        if (familiesDueRecare && familiesDueRecare.length) {
          insights.push({
            type: 'familiesDueRecare',
            value: familiesDueRecare,
          });
        }
      }

      if (insights.length) {
        return {
          appointmentId: appointment.id,
          patientId: patient.id,
          insights,
        };
      }
    });
  return Promise.all(insightsPromises).then(insightsList =>
    uniqBy(insightsList.filter(i => !!i), 'patientId'));
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
async function generateConfirmApptInsight(
  { cellPhoneNumber, email },
  { id },
) {
  const confirmAttempts =
    cellPhoneNumber && email && (await checkConfirmAttempts(id));
  if (confirmAttempts) {
    confirmAttempts.phoneNumber = cellPhoneNumber;
  }
  return (
    (cellPhoneNumber || email) && {
      type: 'confirmAttempts',
      value: confirmAttempts || { cellPhoneNumber },
    }
  );
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

  return Object.values(confirmAttempts).some(a => a > 0) && confirmAttempts;
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
      ...Appointment.getCommonSearchAppointmentSchema(),
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
    where: { accountId },
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
        attributes: [
          'id',
          'dueForRecallExamDate',
          'dueForHygieneDate',
          'firstName',
          'lastName',
        ],
      },
    ],
    required: false,
    attributes: ['id', 'headId'],
  };
}
