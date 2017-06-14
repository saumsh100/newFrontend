
import axios from './axios';
import {
  addAllScheduleFilter,
  setMergingPatient,
  selectAppointment
} from '../actions/schedule';
import {
  receiveEntities
} from '../actions/entities'


export function checkPatientUser(patientUserId, request) {
  return function (dispatch, getState)  {
    // pull requestThatIsBeingConfirmed
    // get patientUserId from request

    //const url = `/api/patients/${patientInfo.id}`
    const query = {
      patientUserId,
    };

    return axios.get('/api/patients', { params: query })
      .then((response) => {
        const { data } = response;
        if (data.result.length > 0) {
          dispatch(receiveEntities({ key: 'patients', entities: data.entities }));
          const patientId = Object.keys(data.entities['patients'])[0];
          request.patientId = patientId;
          dispatch(selectAppointment(request));
          return data.entities;
          // open Appointment modal
          /*} else {
           // No exact patients connected yet
           // Let's check if there are any suggestions
           return axios.get('/api/patients/search', {
           params: {
           firstName,
           lastName,
           email,
           passWord,
           },
           }).then(({ data }) => {
           setSuggestions(data);
           dispatch(setMergingPatient({ isMerging: true }));
           // open create patient modal
           })
           }*/
        }
      });
  };
}



export function setAllFilters(entityKeys) {
  return function (dispatch, getState) {
    const { entities } = getState();

    entityKeys.map((key) => {
      const model = entities.getIn([key, 'models']);

      let filterModel = [];
      if (key === 'services') {
        const practitioners = entities.getIn(['practitioners', 'models']);

        practitioners.map((practitioner) => {
          const practitionerIds = practitioner.get('services');

          practitionerIds.map((serviceId) => {
            if (practitionerIds.indexOf(serviceId) > -1) {
              filterModel.push(model.get(serviceId));
            }
          });
        });

      } else {
        filterModel = model;
      }
      dispatch(addAllScheduleFilter({
        key: `${key}Filter`,
        entities: filterModel
      }));
    });
  };
}


