
import axios from 'axios';
import { setFamilyPatients } from '../actions/auth';

export function fetchFamilyPatients() {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const user = auth.get('patientUser');
    try {
      const familyData = await axios.get(`/families/${user.patientUserFamilyId}/patients`);
      dispatch(setFamilyPatients(familyData.data));
    } catch (err) {
      console.error('fetching familyPatients request error', err);
    }
  };
}