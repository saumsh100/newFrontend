import { set } from 'lodash';
import axios from './axios';
import {
  addAllScheduleFilter,
  setMergingPatient,
  selectAppointment,
} from '../actions/schedule';
import {
  receiveEntities,
} from '../actions/entities';

export function checkPatientUser(patientUser, requestData) {
  return function (dispatch, getState) {
    // AccountId passed up in the query
    const query = {
      patientUserId: patientUser.get('id'),
    };

    return axios.get('/api/patients', { params: query })
    .then((response) => {
      const { data } = response;

      const checkObjEmpty = !_.values(data.entities['patients']).some(x => x !== undefined);
      if (!checkObjEmpty) {
        dispatch(receiveEntities({ key: 'patients', entities: data.entities }));
        const modifiedRequest = requestData;

        set(modifiedRequest, 'patientId', Object.keys(data.entities['patients'])[0]);
        dispatch(selectAppointment(modifiedRequest));

        return data.entities;
      } else {
        const params = {
          firstName: patientUser.get('firstName'),
          lastName: patientUser.get('lastName'),
          email: patientUser.get('email'),
          mobilePhoneNumber: patientUser.get('mobilePhoneNumber'),
        };

        return axios.get('/api/patients/suggestions', { params }).then((searchResponse) => {
          const dataSuggest = searchResponse.data;

          dispatch(receiveEntities({ key: 'patients', entities: dataSuggest.entities }))
          const dataArray = getEntities(dataSuggest.entities);

          dispatch(setMergingPatient({
            patientUser,
            requestData,
            suggestions: dataArray,
          }));
        });
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

function getEntities(entities) {
  const data = [];
  _.each(entities, (collectionMap) => {
    _.each(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}
