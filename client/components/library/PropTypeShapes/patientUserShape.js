
import PropTypes from 'prop-types';

const patientUserShape = {
  birthDate: PropTypes.string,
  avatarUrl: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  gender: PropTypes.string,
  id: PropTypes.string,
  isEmailConfirmed: PropTypes.bool,
  isPhoneNumberConfirmed: PropTypes.bool,
  patientUserFamilyId: PropTypes.string,
  phoneNumber: PropTypes.string,
};

export default patientUserShape;
