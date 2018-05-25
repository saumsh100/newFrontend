
import PropTypes from 'prop-types';

const officeHoursShape = {
  createdAt: PropTypes.string,
  deletedAt: PropTypes.string,
  friday: PropTypes.object,
  id: PropTypes.string,
  isAdvanced: PropTypes.bool,
  monday: PropTypes.object,
  pmsId: PropTypes.string,
  saturday: PropTypes.object,
  startDate: PropTypes.string,
  sunday: PropTypes.object,
  thursday: PropTypes.object,
  tuesday: PropTypes.object,
  updatedAt: PropTypes.string,
  wednesday: PropTypes.object,
  weeklySchedules: PropTypes.string,
};

export default officeHoursShape;
