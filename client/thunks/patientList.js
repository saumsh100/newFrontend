import axios from './axios';

import {
  setSelectedPatientIdAction,
	updateEditingPatientStateAction,
} from '../actions/patientList';

import {
	updatePatientInPatientListAction,
} from '../actions/entities';

export function setCurrentPatient(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentPatientAction({ currentDialogId }));
  };
}

export function updateEditingPatientState(patientSate) {
  return function (dispatch, getState) {
    dispatch(updateEditingPatientStateAction(patientSate));
  };
}


export function changePatientInfo(patientInfo) {
  return function (dispatch, getState) {
  	const url = `/api/patients/${patientInfo.id}`
  	axios.put(url, patientInfo)
  		.then(result => {
    		dispatch(updatePatientInPatientListAction(patientInfo));
  		});
  };
}
