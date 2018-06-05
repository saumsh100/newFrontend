
import PropTypes from 'prop-types';

const appointmentShape = {
  accountId: PropTypes.string,
  chairId: PropTypes.string,
  createdAt: PropTypes.string,
  customBufferTime: PropTypes.string,
  deletedAt: PropTypes.string,
  endDate: PropTypes.string,
  estimatedRevenue: PropTypes.string,
  id: PropTypes.string,
  isBookable: PropTypes.bool,
  isCancelled: PropTypes.bool,
  isDeleted: PropTypes.bool,
  isPatientConfirmed: PropTypes.bool,
  isPending: PropTypes.bool,
  isPreConfirmed: PropTypes.bool,
  isRecall: PropTypes.bool,
  isReminderSent: PropTypes.bool,
  isShortCancelled: PropTypes.bool,
  isSyncedWithPms: PropTypes.bool,
  note: PropTypes.string,
  originalDate: PropTypes.string,
  patientId: PropTypes.string,
  pmsId: PropTypes.string,
  practitionerId: PropTypes.string,
  reason: PropTypes.string,
  serviceId: PropTypes.string,
  startDate: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default appointmentShape;
