import axios from './axios';
import {
	sixDaysShiftAction,
	setDayAction,
	setPractitionerAction,
	setServiceAction,
	createPatientAction,
	setStartingAppointmentTimeAction,
  setRegistrationStepAction,
  setLogoAction,
} from '../actions/availabilities';

export function sixDaysShift(dayObj) {
  return function (dispatch, getState) {
    dispatch(sixDaysShiftAction(dayObj));
  };
}

export function setDay() {
	return function (dispatch, getState) {
		dispatch(setDayAction({ }));
	}
}

export function setPractitioner(practitionerId) {
	return function (dispatch, getState) {
		dispatch(setPractitionerAction(practitionerId));
	}	
}

export function setService(serviceId) {
	return function (dispatch, getState) {
		dispatch(setServiceAction(serviceId));
	}	
}

export function createPatient(params) {
	const {
		firstName,
		lastName,
		email,
		phone,

    startsAt,
    patientId,
    serviceId,
    practitionerId,
    domen,
    accountId,
	} = params;
	return function (dispatch, getState) {
		const patientParams = { firstName, lastName, email, phone, accountId }
    const url = domen ? '/patients' : 'api/patients'; 
    axios.post(url, patientParams)
      .then((result) => {
        dispatch(createPatientAction(params));
        const saveParams = { 
        	isConfirmed: false,
    			isCancelled: false,
			    startTime: startsAt,
			    patientId: result.data.result,
			    serviceId,
			    practitionerId,
			    domen,
			    accountId,
        }
				const requestUrl = domen ? '/requests' : 'api/requests'; 
		    axios.post(requestUrl, saveParams)
		      .then(() => {
						dispatch(saveRequestAction(params));
		      })
		      .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
	}	
}

export function setStartingAppointmentTime(startsAt) {
	return function (dispatch, getState) {
		dispatch(setStartingAppointmentTimeAction(startsAt));
	}	
}

export function setRegistrationStep(registrationStep) {
  return function (dispatch, getState) {
			dispatch(setRegistrationStepAction(registrationStep));
  }
}

export function getLogo(accountId) {
  return function (dispatch, getState) {
	  axios.get(`/logo/${accountId}`).then( (data => {	
	  	const binaryImage = data.data.logo.data;
	  	
	  	const blobchik = new Blob(binaryImage, {type: "image/png"});
	  	const logo = `data:image/jpeg;base64,${btoa(blobchik)}`;
	  	// const logo = `data:image/jpeg;base64,${btoa(binaryImage)}`;
	  	
	  	dispatch(setLogoAction(logo))

	  }).bind(this) )
  }

}