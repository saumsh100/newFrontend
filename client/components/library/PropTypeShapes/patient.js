
import PropTypes from 'prop-types';

const PatientShape = {
  accountId: PropTypes.string,
  address: PropTypes.objectOf(PropTypes.string),
  avatarUrl: PropTypes.string,
  birthDate: PropTypes.string,
  dueForHygieneDate: PropTypes.string,
  dueForRecallExamDate: PropTypes.string,
  email: PropTypes.string,
  firstApptDate: PropTypes.string,
  firstApptId: PropTypes.string,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  homePhoneNumber: PropTypes.number,
  id: PropTypes.string,
  insurance: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string,
      defaultValue: PropTypes.objectOf(PropTypes.bool),
    })
  ),
  insuranceInterval: PropTypes.string,
  isDeleted: PropTypes.bool,
  isFetching: PropTypes.bool,
  isSyncedWithPms: PropTypes.bool,
  language: PropTypes.string,
  lastApptDate: PropTypes.string,
  lastApptId: PropTypes.string,
  lastHygieneApptId: PropTypes.string,
  lastHygieneDate: PropTypes.string,
  lastName: PropTypes.string,
  lastRecallApptId: PropTypes.string,
  lastRecallDate: PropTypes.string,
  lastRestorativeApptId: PropTypes.string,
  lastRestorativeDate: PropTypes.string,
  lastUpdated: PropTypes.number,
  middleName: PropTypes.string,
  mobilePhoneNumber: PropTypes.string,
  nextApptDate: PropTypes.string,
  nextApptId: PropTypes.string,
  otherPhoneNumber: PropTypes.number,
  patientId: PropTypes.string,
  patientUserId: PropTypes.string,
  photo: PropTypes.string,
  preferences: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string,
      defaultValue: PropTypes.objectOf(PropTypes.bool),
    })
  ),
  preferredPhoneNumber: PropTypes.number,
  status: PropTypes.string,
  workNumber: PropTypes.number,
};

export default PatientShape;