import { set } from 'lodash';
import moment from 'moment';
import axios from 'axios';
import {
  addAllScheduleFilter,
  setMergingPatient,
  selectAppointment,
  setScheduleDate,
} from '../actions/schedule';
import {
  receiveEntities,
} from '../actions/entities';
import {
  updateEntityRequest,
} from "./fetchEntities";

export function checkPatientUser(patientUser, requestData) {
  return async function (dispatch, getState) {
    // AccountId passed up in the query
    const query = {
      patientUserId: patientUser.get('id'),
    };

    try {
      const patientData = await axios.get('/api/patients', { params: query });

      const { data } = patientData;
      const checkObjEmpty = !_.values(data.entities['patients']).some(x => x !== undefined);

      if (!checkObjEmpty) {
        return connectedPatientUser(dispatch, requestData, data);
      }

      return suggestedPatients(dispatch, requestData, patientUser);
    } catch (err) {
      throw err;
    }
  };
}

async function connectedPatientUser(dispatch, requestData, data) {

  const patientId = Object.keys(data.entities.patients)[0];
  dispatch(receiveEntities({ key: 'patients', entities: data.entities }));

  const query = {
    requestCreatedAt: requestData.createdAt,
  };

  const modifiedRequest = requestData;
  set(modifiedRequest, 'patientId', patientId);

  const appInfo = await axios.get(`/api/patients/${patientId}/nextAppointment`, { params: query });
  const appointment = appInfo.data.entities.appointments;
  if (appointment) {
    const appList = getEntities(appInfo.data.entities);
    set(modifiedRequest, 'nextAppt', appList);
    dispatch(selectAppointment(modifiedRequest));
  }

  dispatch(selectAppointment(modifiedRequest));
  return data.entities;
}

async function suggestedPatients(dispatch, requestData, patientUser) {
  const params = {
    firstName: patientUser.get('firstName'),
    lastName: patientUser.get('lastName'),
    email: patientUser.get('email'),
    mobilePhoneNumber: patientUser.get('phoneNumber'),
    requestCreatedAt: requestData.createdAt,
  };

  const searchResponse = await axios.get('/api/patients/suggestions', { params });
  const dataSuggest = searchResponse.data;
  dispatch(receiveEntities({ key: 'patients', entities: dataSuggest.entities }));

  const dataArray = getEntities(dataSuggest.entities);
  dispatch(setMergingPatient({
    patientUser,
    requestData,
    suggestions: dataArray,
  }));

  return dataArray;
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
        entities: filterModel,
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
