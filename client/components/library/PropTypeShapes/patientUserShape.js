
import PropTypes from 'prop-types';

const patientUserShape = {
  avatarUrl: PropTypes.string,
  birthDate: PropTypes.string,
  createdAt: PropTypes.string,
  deletedAt: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  id: PropTypes.string,
  insuranceCarrier: PropTypes.string,
  insuranceGroupId: PropTypes.string,
  insuranceMemberId: PropTypes.string,
  isEmailConfirmed: PropTypes.bool,
  isPhoneNumberConfirmed: PropTypes.bool,
  lastName: PropTypes.string,
  patientUserFamilyId: PropTypes.string,
  phoneNumber: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default patientUserShape;
