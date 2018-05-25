
import Proptypes from 'prop-types';

export const dayShape = {
  breaks: Proptypes.arrayOf(Proptypes.string),
  chairIds: Proptypes.arrayOf(Proptypes.string),
  endTime: Proptypes.string,
  isClosed: Proptypes.bool,
  pmsScheduleId: Proptypes.string,
  startTime: Proptypes.string,
};

export const weeklyScheduleShape = {
  id: Proptypes.string,
  startDate: Proptypes.string,
  isAdvanced: Proptypes.bool,
  monday: Proptypes.shape(dayShape),
  tuesday: Proptypes.shape(dayShape),
  wednesday: Proptypes.shape(dayShape),
  thursday: Proptypes.shape(dayShape),
  friday: Proptypes.shape(dayShape),
  saturday: Proptypes.shape(dayShape),
  sunday: Proptypes.shape(dayShape),
  pmsId: Proptypes.string,
  weeklySchedules: Proptypes.arrayOf(Proptypes.any),
};
