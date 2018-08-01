
import axios from 'axios';
import { setFamilyPatientUser } from '../actions/availabilities';
import {
  addPatientToFamily,
  setFamilyPatients,
  updateFamilyPatient,
  updatePatientUser,
} from '../reducers/patientAuth';

const getAuth = getState => getState().auth;

const handleFamilyId = (patientFamilyId, getState) =>
  patientFamilyId ||
  getAuth(getState)
    .get('patientUser')
    .get('patientUserFamilyId');

export function fetchFamilyPatients(patientFamilyId) {
  return async (dispatch, getState) => {
    try {
      const familyData = await axios.get(`/families/${handleFamilyId(patientFamilyId, getState)}/patients`);
      return dispatch(setFamilyPatients(familyData.data));
    } catch (err) {
      return console.error('fetching familyPatients request error', err);
    }
  };
}

export function addNewFamilyPatient(values, patientFamilyId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.post(
        `/families/${handleFamilyId(patientFamilyId, getState)}/patients`,
        values,
      );
      dispatch(addPatientToFamily(data));
      return dispatch(setFamilyPatientUser(data.id));
    } catch (err) {
      return console.error('add new familyPatient request error', err);
    }
  };
}

export function updatePatient(values, patientId, patientFamilyId) {
  return async (dispatch, getState) => {
    try {
      const updatedUser = await axios.put(
        `/families/${handleFamilyId(patientFamilyId, getState)}/patients/${patientId}`,
        values,
      );
      dispatch(updateFamilyPatient({ patientId, values }));
      if (
        patientId ===
        getAuth(getState)
          .get('patientUser')
          .get('id')
      ) {
        dispatch(updatePatientUser(values));
      }

      return updatedUser;
    } catch (err) {
      return console.error('add new familyPatient request error', err);
    }
  };
}
