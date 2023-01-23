import PropTypes from 'prop-types';

const practitionerShape = {
  id: PropTypes.string,
  accountId: PropTypes.string,
  pmsId: PropTypes.string,
  type: PropTypes.string,
  isActive: PropTypes.bool,
  isHidden: PropTypes.bool,
  multiBookingEnabled: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatarUrl: PropTypes.string,
  isCustomSchedule: PropTypes.bool,
  fullAvatarUrl: PropTypes.string,
  weeklyScheduleId: PropTypes.string,
};

export default practitionerShape;
