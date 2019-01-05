
import { setDateToTimezone } from '@carecru/isomorphic';
import { RELATIVE_BEFORE, RELATIVE_AFTER } from './';

const dateNowToISOString = (date = Date.now()) => new Date(date).toISOString();

export const normalizeOffset = (offset, comparator) =>
  (comparator === RELATIVE_BEFORE ? `-${offset}` : offset);

export const generateQuery = dates => ({ $between: dates.sort() });

export const addRelativeTime = (offset, date = Date.now()) =>
  setDateToTimezone(date)
    .add(...offset.split(' '))
    .toISOString();

const calculateSingleOffset = (value, comparator) => {
  const normalizedCurrentDate = dateNowToISOString();

  if (typeof value === 'string') {
    return calculateSingleOffset(
      {
        interval: value,
        date: normalizedCurrentDate,
      },
      comparator,
    );
  }

  const { interval, date } = value;

  const normalizedOffset = normalizeOffset(interval, comparator);
  const offSettedDate = addRelativeTime(normalizedOffset, date);

  return generateQuery([offSettedDate, date]);
};

const calculateRelativeBetween = (value) => {
  const normalizedCurrentDate = dateNowToISOString();

  if (Array.isArray(value)) {
    return calculateRelativeBetween({
      interval: value,
      date: normalizedCurrentDate,
    });
  }

  const {
    interval: [firstInterval, lastInterval],
    date,
  } = value;

  return generateQuery([
    addRelativeTime(normalizeOffset(firstInterval, RELATIVE_BEFORE), date),
    addRelativeTime(lastInterval, date),
  ]);
};

export const relativeBefore = value =>
  calculateSingleOffset(value, RELATIVE_BEFORE);
export const relativeAfter = value =>
  calculateSingleOffset(value, RELATIVE_AFTER);
export const relativeBetween = value => calculateRelativeBetween(value);
