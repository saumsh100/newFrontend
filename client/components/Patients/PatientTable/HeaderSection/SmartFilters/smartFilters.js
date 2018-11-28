
const smartFilters = [
  {
    label: 'All Patients',
    segment: 'allPatients',
  },
  {
    label: 'Due within 60 Days',
    segment: 'dueWithin',
  },
  {
    label: '0-3 Months Late',
    segment: 'lateAppointments',
  },
  {
    label: '4-6 Months Late',
    segment: 'lateAppointments',
    value: [6, 4],
  },
  {
    label: '7-12 Months Late',
    segment: 'lateAppointments',
    value: [12, 7],
  },
  {
    label: '13-18 Months Late',
    segment: 'lateAppointments',
    value: [18, 13],
  },
  {
    label: '19-24 Months Late',
    segment: 'lateAppointments',
    value: [24, 19],
  },
  {
    label: '25-36 Months Late',
    segment: 'lateAppointments',
    value: [36, 25],
  },
  {
    label: 'Missed/Cancelled',
    segment: 'missedCancelled',
  },
  {
    label: 'Missed Pre-Appointed',
    segment: 'missedPreAppointed',
  },
  {
    label: 'Unconfirmed Patients 2 weeks',
    segment: 'unConfirmedPatients',
    value: [14],
  },
  {
    label: 'Unconfirmed Patients 1 week',
    segment: 'unConfirmedPatients',
  },
];

export const getActiveSmartFilter = ([segment, ...args]) => {
  const baseSegment = smartFilters.filter(s => s.segment === segment);
  return args.length === 0
    ? baseSegment.find(s => !s.value)
    : baseSegment.find(s => s.value && s.value.every(v => args.includes(v)));
};

export default smartFilters;
