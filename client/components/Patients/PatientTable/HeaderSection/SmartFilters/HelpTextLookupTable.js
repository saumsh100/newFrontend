const HelpTextLookupTable = {
  'All Patients': {
    status: 'Active',
    description: 'All active patients',
    communication: null,
    followUp: null,
  },
  'Due Within 60 Days': {
    status: 'Active',
    description:
      'Active patients who are due in the next 60 days for hygiene/recall and not scheduled',
    communication: null,
    followUp: null,
  },
  '0-3 Months Late': {
    status: 'Active',
    description: 'Active patients who are 0-3 months overdue for hygiene/recall and not scheduled',
    communication: null,
    followUp: null,
  },
  '4-6 Months Late': {
    status: 'Active',
    description: 'Active patients who are 4-6 months overdue for hygiene/recall and not scheduled',
    communication: null,
    followUp: null,
  },
  '7-12 Months Late': {
    status: 'Active',
    description: 'Active patients who are 7-12 months overdue for hygiene/recall and not scheduled',
    communication: null,
    followUp: null,
  },
  '13-18 Months Late': {
    status: 'Active',
    description:
      'Active patients who are 13-18 months overdue for hygiene/recall and not scheduled',
    communication: null,
    followUp: null,
  },
  '19-24 Months Late': {
    status: 'Active',
    description:
      'Active patients who are 19-24 months overdue for hygiene/recall and not scheduled',
    communication: null,
    recalls: 'No recalls logged in the last 30 days',
    followUp: null,
  },
  '25-36 Months Late': {
    status: 'Active',
    description:
      'Active patients who are 25-36 months overdue for hygiene/recall and not scheduled',
    communication: null,
    recalls: 'No recalls logged in the last 30 days',
    followUp: null,
  },
  'Missed/Cancelled': {
    status: 'Active',
    description:
      'Patients who missed (no-showed) or cancelled an appt within the last 3 months, and did not reschedule',
    communication: null,
    followUp: null,
  },
  'Missed Pre-appointed': {
    status: 'Active',
    description: 'Patients who completed an appt in the past 30 days, and did not reschedule',
    communication: null,
    followUp: null,
  },
  'Unconfirmed Patients (2 Weeks)': {
    status: 'Active',
    description:
      'Patients who have upcoming appts in the next 2 weeks, but have not confirmed their appt',
    communication: null,
    followUp: null,
  },
  'Unconfirmed Patients (1 Week)': {
    status: 'Active',
    description:
      'Patients who have upcoming appts in the next 7 days, but have not confirmed their appt',
    communication: null,
    followUp: null,
  },
  'Smart Recare': {
    status: 'Active',
    description:
      'Active patients who are overdue for hygiene/recall 0-1, 2-3, 6-7, 12-13, 17-18 months, and not scheduled.',
    communication: 'No logged conversations within 30 days before or after today',
    followUp: 'No follow ups scheduled after today',
  },
  'Follow Ups': {
    status: 'Active and Inactive',
    description: 'Active and Inactive patients who have an incomplete follow up',
    communication: null,
    followUp: 'Follow up scheduled',
  },
  'My Follow Ups (Past 30 Days)': {
    status: 'Active and Inactive',
    description:
      'Active and Inactive patients who have an incomplete follow up that was due to be completed in the last 30 days and is assigned to me',
    communication: null,
    followUp: 'Follow up scheduled',
  },
};

export default HelpTextLookupTable;
