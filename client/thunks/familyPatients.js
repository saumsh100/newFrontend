
import axios from 'axios';
import { setFamilyPatients } from '../actions/auth';
import { setPatientUser } from '../actions/availabilities';

export function fetchFamilyPatients() {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const user = auth.get('patientUser');
    try {
      const familyData = await axios.get(`/families/${user.patientUserFamilyId}/patients`);
      return dispatch(setFamilyPatients(familyData.data));
    } catch (err) {
      return console.error('fetching familyPatients request error', err);
    }
  };
}

export function addNewFamilyPatient(values) {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const user = auth.get('patientUser');
    try {
      const newUser = await axios.post(`/families/${user.patientUserFamilyId}/patients`, values);
      dispatch(fetchFamilyPatients());
      return newUser;
    } catch (err) {
      return console.error('add new familyPatient request error', err);
    }
  };
}

export function updateFamilyPatient(values, patientId) {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const user = auth.get('patientUser');
    try {
      const updatedUser = await axios.put(
        `/families/${user.patientUserFamilyId}/patients/${patientId}`,
        values,
      );
      if (patientId === user.id) {
        dispatch(setPatientUser({ ...user.toJS(), ...values }));
      }
      dispatch(fetchFamilyPatients());
      return updatedUser;
    } catch (err) {
      return console.error('add new familyPatient request error', err);
    }
  };
}
