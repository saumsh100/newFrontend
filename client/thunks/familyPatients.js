
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

export function addNewFamilyPatient(values) {
  return async (_, getState) => {
    const { auth } = getState();
    const user = auth.get('patientUser');
    try {
      return axios.post(`/families/${user.patientUserFamilyId}/patients`, values);
    } catch (err) {
      return console.error('add new familyPatient request error', err);
    }
  };
}

export function updateFamilyPatient(values, patientId) {
  return async (_, getState) => {
    const { auth } = getState();
    const user = auth.get('patientUser');
    try {
      return axios.put(`/families/${user.patientUserFamilyId}/patients/${patientId}`, values);
    } catch (err) {
      return console.error('add new familyPatient request error', err);
    }
  };
}
