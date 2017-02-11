import axios from './axios';

import {
	setCurrentPatientAction,
	updateEditingPatientStateAction,
	changePatientInfoAction,
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
  	console.log("patientInfo")
  	console.log(patientInfo)
  	axios.put(url, patientInfo)
  		.then(result => {		
    		dispatch(changePatientInfoAction(patientInfo));
    		dispatch(updatePatientInPatientListAction(patientInfo));
  		});
  };
}
