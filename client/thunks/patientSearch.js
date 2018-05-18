
import jwt from 'jwt-decode';
import { setPatientSearchedAction, setPatientSearchedListAction } from '../reducers/patientSearch';
import addPatientSearch from '../components/RelayPatientSearch/addPatientSearch';
import fetchPatientSearches from '../components/RelayPatientSearch/fetchPatientSearches';

export const setPatientSearched = patient => (dispatch) => {
  const token = localStorage.getItem('token');
  const { activeAccountId, userId } = jwt(token);

  addPatientSearch
    .commit({
      patientId: patient.ccId,
      accountId: activeAccountId,
      userId,
    })
    .then(addedPatient => dispatch(setPatientSearchedAction(addedPatient)));
};

export const setPatientSearchedList = () => dispatch =>
  fetchPatientSearches().then(patientList => dispatch(setPatientSearchedListAction(patientList)));
