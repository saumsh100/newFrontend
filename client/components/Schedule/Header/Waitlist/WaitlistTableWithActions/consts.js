
import { generateDaysOfWeek } from '../helpers';

export const DEFAULT_DAY_OF_WEEK = generateDaysOfWeek(false);
export const DEFAULT_REASONS = {
  hygiene: false,
  recall: false,
  restorative: false,
};
export const DEFAULT_UNITS_RANGE = {
  min: null,
  max: null,
};

export const NOT_SET_LABEL = '(not set)';
export const NOT_SET_VALUE = '(not set)';

export const NOT_SET_OPTION = [
  {
    value: NOT_SET_VALUE,
    label: NOT_SET_LABEL,
  },
];
