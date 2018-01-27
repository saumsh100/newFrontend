
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import { Patient, Appointment, SentReminder } from '../../_models';


/**
 * [checkMobileNumber checks if mobile number exists]
 * @param  {[object]} patient [patient model]
 * @return {[boolean]}         [true or false]
 */
export function checkMobileNumber(patient) {
  return !patient.mobilePhoneNumber;
}

/**
 * [checkEmail checks if email exists]
 * @param  {[object]} patient [patient model]
 * @return {[boolean]}         [true or false]
 */
export function checkEmail(patient) {
  return !patient.email;
}


/*  Takes an accountId, startDate, and endDate and get's appointments in that range
and puts all insights together in the following format
[
  {
    ...appointmentModel,
    ...patientModel,
    missingMobilePhone: true/false,
    missingEmail: true/false,
    // if isPatientConfirmed from appointment is false,
    confirmAttempts: {
      email: 5,
      phone: 2,
      sms: 7,
      // use to contact them may be null if it is don't display.
      phoneNumber: '+16045555555'
    },
    familiesDueRecare: [
      {
        firstName: 'Sally',
        lastName: 'Park',
        dateDue: '2017-10-12'
      },
    ],
  }
]
*/
export async function allInsights(accountId, startDate, endDate) {
   let appointments = await Appointment.findAll({
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },
      isCancelled: false,
      isPending: false,
    },
    include: [{
      model: Patient,
      as: 'patient',
      required: true,
    }],
    raw: true,
    nest: true,
    order: [['startDate', 'DESC']],
  });


  const resultAppointments = [];

  appointments = uniqBy(appointments, 'patientId');

  // loop through all appointments in the period and calculate each insight
  for (let i = 0; i < appointments.length; i += 1) {
    const appointment = appointments[i];
    const patient = appointment.patient;

    const missingMobilePhone = checkMobileNumber(patient);
    const missingEmail = checkEmail(patient);

    const familiesDueRecare = await familyRecare(appointment.patient.familyId,
      appointment.patient.id, startDate);

    if (!appointment.isPatientConfirmed) {
      const confirmAttempts = await checkConfirmAttempts(appointment.id);

      confirmAttempts.phoneNumber = patient.homePhoneNumber
        || patient.workPhoneNumber
        || patient.mobilePhoneNumber;

      appointment.confirmAttempts = confirmAttempts;
    }

    // check if there's any insights. If they are push the appointment to send
    if (missingMobilePhone || missingEmail || !familiesDueRecare[0] || !appointment.isConfirmed) {
      appointment.missingMobilePhone = missingMobilePhone;
      appointment.missingEmail = missingEmail;
      appointment.familiesDueRecare = familiesDueRecare;

      resultAppointments.push(appointment);
    }
  }

  return resultAppointments;
}

/**
 * [formatInsights description]
 * @param  {[object]} insights [takes in insights from All Insights an formats it for front end]
 * @return {[object]}  [[{
  patientId: safjhsad,
  appointmentId: asdasdas,
  insights: [{
    type: 'missingPhoneNumber',
    value: null,
  }]
}]
 */
export async function formatingInsights(insights) {
  const sendInsights = [];

  for (let i = 0; i < insights.length; i += 1) {
    const insight = insights[i];
    const formatInsights = [];

    if (insight.missingMobilePhone) {
      formatInsights.push({
        type: 'missingMobilePhone',
        value: null,
      });
    }

    if (insight.missingEmail) {
      formatInsights.push({
        type: 'missingEmail',
        value: null,
      });
    }

    if (insight.familiesDueRecare[0]) {
      formatInsights.push({
        type: 'familiesDueRecare',
        value: insight.familiesDueRecare,
      });
    }

    if (!insight.isPatientConfirmed && insight.confirmAttempts.phoneNumber) {
      formatInsights.push({
        type: 'confirmAttempts',
        value: insight.confirmAttempts,
      });
    }

    sendInsights.push({
      appointmentId: insight.id,
      patientId: insight.patientId,
      insights: formatInsights,
    });
  }
  return sendInsights;
}

/**
 * [familyRecare returns which people in a family is due for a recare. Can pass
 * in patientId or an array of Ids to not include certain patients]
 * @param  {[uuid]} familyId  [familyId]
 * @param  {[uuid]} patientId [patientId or array of patientIds ]
 * @return {[object]}           [patient Model with recareDate]
 */
export async function familyRecare(familyId, patientId, startDate) {
  const sixMonthsAgo = moment(startDate).subtract(6, 'months');

  if (familyId == null) {
    return [];
  }

  const patients = await Patient.findAll({
    raw: true,
    where: {
      id: {
        $ne: patientId,
      },
      familyId,
      lastHygieneDate: {
        $lte: sixMonthsAgo.toISOString(),
        $ne: null,
      },
      nextApptDate: null,
      status: 'Active',
    },
  });

  for (let i = 0; i < patients.length; i += 1) {
    const patient = patients[i];
    patient.dateDue = moment(patient.lastHygieneDate).add(6, 'months').toISOString();
  }

  return patients;
}

/**
 * [checkConfirmAttempts checks how many attempts CareCru tried for a Appointment Confirmation]
 * @param  {[uuid]} appointmentId
 * @return {[object]}               [object with a tally of email, sms, and phone]
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
