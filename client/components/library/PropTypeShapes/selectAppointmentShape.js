
import PropTypes from 'prop-types';
import Requests from '../../../entities/models/Request';

export default {
  createdAt: PropTypes.string,
  customBufferTime: PropTypes.number,
  endDate: PropTypes.string,
  isSyncedWithPms: PropTypes.bool,
  note: PropTypes.string,
  patientId: PropTypes.string,
  practitionerId: PropTypes.string,
  request: PropTypes.bool,
  requestId: PropTypes.string,
  requestModel: PropTypes.instanceOf(Requests),
  serviceId: PropTypes.string,
  startDate: PropTypes.string,
};
