
import PropTypes from 'prop-types';

const reminderShape = {
  id: PropTypes.string,
  accountId: PropTypes.string,
  primaryType: PropTypes.oneOf(['phone', 'email', 'sms']),
  primaryTypes: PropTypes.arrayOf(PropTypes.string),
  lengthSeconds: PropTypes.number,
  interval: PropTypes.string,
  isActive: PropTypes.bool,
  isDeleted: PropTypes.bool,
  isCustomConfirm: PropTypes.bool,
  customConfirmData: PropTypes.string,
  isConfirmable: PropTypes.bool,
  omitPractitionerIds: PropTypes.arrayOf(PropTypes.string),
  omitChairIds: PropTypes.arrayOf(PropTypes.string),
  ignoreSendIfConfirmed: PropTypes.bool,
  isDaily: PropTypes.bool,
  dailyRunTime: PropTypes.string,
  dontSendWhenClosed: PropTypes.bool,
};

export default reminderShape;
