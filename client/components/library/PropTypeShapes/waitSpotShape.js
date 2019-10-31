
import PropTypes from 'prop-types';
import PatientShape from './patient';
import patientUserShape from './patientUserShape';

const waitSpotShape = {
  availableTimes: PropTypes,
  id: PropTypes.string,
  ccId: PropTypes.string,
  patientUserId: PropTypes.string,
  patientId: PropTypes.string,
  preferences: PropTypes.shape({
    evenings: PropTypes.bool,
    mornings: PropTypes.bool,
    afternoons: PropTypes.bool,
  }),
  unavailableDays: PropTypes.string,
  daysOfTheWeek: PropTypes.shape({
    friday: PropTypes.bool,
    monday: PropTypes.bool,
    sunday: PropTypes.bool,
    tuesday: PropTypes.bool,
    saturday: PropTypes.bool,
    thursday: PropTypes.bool,
    wednesday: PropTypes.bool,
  }),
  endDate: PropTypes.string,
  createdAt: PropTypes.string,
  patient: PropTypes.shape(PatientShape),
  patientUser: PropTypes.shape(patientUserShape),
  clientId: PropTypes.string,
  accountViewerClientId: PropTypes.string,
  removeWaitSpot: PropTypes.func,
  isPatientUser: PropTypes.bool,
  removeBorder: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
};

export default waitSpotShape;
