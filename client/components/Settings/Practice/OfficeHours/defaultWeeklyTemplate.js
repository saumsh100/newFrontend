
const defaultSC = {
  breaks: [],
  chairIds: [],
  endTime: '1970-02-01T01:00:00.000Z',
  isClosed: false,
  isFeatured: false,
  isDailySchedule: false,
  startTime: '1970-01-31T17:00:00.000Z',
};

const defaultDays = {
  sunday: defaultSC,
  monday: defaultSC,
  tuesday: defaultSC,
  wednesday: defaultSC,
  thursday: defaultSC,
  friday: defaultSC,
  saturday: defaultSC,
};

export default defaultDays;
