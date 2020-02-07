
const HelpTextLookupTable = {
  'All Patients': {
    status: 'Active',
    description: 'All Active Patients',
    communication: null,
    followUp: null,
  },
  'Due within 60 Days': {
    status: 'Active',
    description:
      'Active Patients who are due in the next 60 days for a Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  '0-3 Months Late': {
    status: 'Active',
    description:
      'Active Patients who are 0-3 Months overdue for their Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  '4-6 Months Late': {
    status: 'Active',
    description:
      'Active Patients who are 4-6 Months overdue for their Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  '7-12 Months Late': {
    status: 'Active',
    description:
      'Active Patients who are 7-12 Months overdue for their Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  '13-18 Months Late': {
    status: 'Active',
    description:
      'Active Patients who are 13-18 Months overdue for their Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  '19-24 Months Late': {
    status: 'Active',
    description:
      'Active Patients who are 19-24 Months overdue for their Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  '25-36 Months Late': {
    status: 'Active',
    description:
      'Active Patients who are 25-36 Months overdue for their Hygiene Appt and not scheduled',
    communication: null,
    followUp: null,
  },
  'Missed/Cancelled': {
    status: 'Active',
    description: 'Patients who have missed or cancelled their appointment within the last 30 days',
    communication: null,
    followUp: null,
  },
  'Missed Pre-Appointed': {
    status: 'Active',
    description:
      'Patients who completed a hygiene appt in the past 30 days, but did not schedule their next appointment',
    communication: null,
    followUp: null,
  },
  'Unconfirmed Patients 2 weeks': {
    status: 'Active',
    description:
      'Patients who have upcoming appointments in the next 2 weeks, but have not confirmed their appointment',
    communication: null,
    followUp: null,
  },
  'Unconfirmed Patients 1 week': {
    status: 'Active',
    description:
      'Patients who have upcoming appointments in the next 7 days, but have not confirmed their appointment',
    communication: null,
    followUp: null,
  },
  'Smart Recare': {
    status: 'Active',
    description: 'Active Patients who are overdue for hygiene and not scheduled.',
    communication: 'No logged conversations within 30 days before or after today',
    followUp: 'No follow ups scheduled after today',
  },
  'Follow Ups': {
    status: 'Active',
    description: 'Active Patients who have an incomplete follow up',
    communication: null,
    followUp: 'Follow up scheduled',
  },
  'My Follow Ups (past 30 days)': {
    status: 'Active',
    description:
      'Active Patients who have an incomplete follow ups assigned to me who are overdue for the past 30 days',
    communication: null,
    followUp: 'Follow up scheduled',
  },
};

export default HelpTextLookupTable;
