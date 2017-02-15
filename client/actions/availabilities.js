import { createAction } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_DAY,
} from '../constants';

export const sixDaysShiftAction  = createAction(SIX_DAYS_SHIFT);
export const setDayAction = createAction(SET_DAY);
