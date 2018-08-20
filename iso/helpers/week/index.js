
const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const weekEnds = ['sunday', 'saturday'];

export const frames = {
  all: 'all',
  weekdays: 'weekdays',
  weekends: 'weekends',
};

export const week = {
  [frames.all]: [weekEnds[0], ...weekDays, weekEnds[1]],
  [frames.weekdays]: weekDays,
  [frames.weekends]: weekEnds,
};

export const dayToFrame = day =>
  (week[frames.weekdays].includes(day) ? frames.weekdays : frames.weekends);
