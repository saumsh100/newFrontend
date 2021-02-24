
import PropTypes from 'prop-types';

const callShape = {
  id: PropTypes.string,
  accountId: PropTypes.string,
  patientId: PropTypes.string,
  dateTime: PropTypes.string,
  answered: PropTypes.bool,
  voicemail: PropTypes.bool,
  wasApptBooked: PropTypes.bool,
  direction: PropTypes.string,
  duration: PropTypes.number,
  priorCalls: PropTypes.number,
  recording: PropTypes.string,
  recordingDuration: PropTypes.string,
  startTime: PropTypes.string,
  totalCalls: PropTypes.number,
  callerCity: PropTypes.string,
  callerCountry: PropTypes.string,
  callerName: PropTypes.string,
  callerNum: PropTypes.string,
  callerZip: PropTypes.string,
  callerState: PropTypes.string,
  campaign: PropTypes.string,
  destinationNum: PropTypes.string,
  trackingNum: PropTypes.string,
  callSource: PropTypes.string,
  isFetching: PropTypes.bool,
};

export default callShape;
