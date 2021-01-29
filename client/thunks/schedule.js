
import set from 'lodash/set';
import values from 'lodash/values';
import each from 'lodash/each';
import size from 'lodash/size';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import { addAllScheduleFilter, selectAppointment, setMergingPatient } from '../actions/schedule';
import { receiveEntities } from '../reducers/entities';
import { httpClient } from '../util/httpClient';
import { updateEntityRequest } from './fetchEntities';
import { getUTCDate, nonApptWritePMS } from '../components/library';

export function checkPatientUser(patientUser, requestData) {
  return async function (dispatch, getState) {
    const { auth } = getState();
    const apptWrite = !nonApptWritePMS(auth.get('adapterType'));

    // AccountId passed up in the query
    const query = { patientUserId: patientUser.get('id') };

    try {
      const patientData = await httpClient().get('/api/patients', { params: query });

      const { data } = patientData;
      const checkObjEmpty = !values(data.entities.patients).some(x => x !== undefined);

      if (!checkObjEmpty) {
        return connectedPatientUser(dispatch, requestData, data, patientUser);
      }

      return suggestedPatients(dispatch, requestData, patientUser, apptWrite);
    } catch (err) {
      throw err;
    }
  };
}

async function connectedPatientUser(dispatch, requestData, data, patientUser) {
  const patient = Object.values(data.entities.patients)[0];
  const patientId = patient.id;
  dispatch(
    receiveEntities({
      key: 'patients',
      entities: data.entities,
    }),
  );

  const query = { requestCreatedAt: requestData.createdAt };

  const modifiedRequest = Object.assign({}, requestData);
  set(modifiedRequest, 'patientId', patientId);

  const appInfo = await httpClient().get(`/api/patients/${patientId}/nextAppointment`, {
    params: query,
  });
  const params = suggestionParams(patientUser, requestData);

  if (appInfo.data.entities.appointments) {
    const appList = getEntities(appInfo.data.entities);
    const exactMatch = [];
    const partialMatch = [];

    appList.forEach((appointment) => {
      matchPatient(patient, params, appointment, requestData, exactMatch, partialMatch);
    });

    if (size(exactMatch)) {
      const selectedApp = exactMatch[0];
      const name = `${patient.firstName} ${patient.lastName}`;
      dispatch(
        updateEntityRequest({
          url: `/api/requests/${requestData.requestId}/confirm/${selectedApp.id}`,
          values: {},
          alert: alertRequestUpdate(name),
        }),
      );
      return data.entities;
    }
    if (size(partialMatch)) {
      set(modifiedRequest, 'nextAppt', appList);
      dispatch(selectAppointment(modifiedRequest));
    }
  }

  dispatch(selectAppointment(modifiedRequest));
  return data.entities;
}

async function suggestedPatients(dispatch, requestData, patientUser, apptWrite) {
  const params = suggestionParams(patientUser, requestData);
  const searchResponse = await httpClient().get('/api/patients/suggestions', { params });
  const dataSuggest = searchResponse.data;
  dispatch(
    receiveEntities({
      key: 'patients',
      entities: dataSuggest.entities,
    }),
  );

  const cloneRequestData = Object.assign({}, requestData);

  const patients = getEntities(dataSuggest.entities);
  const patientsWithAppts = filter(patients, item => !!size(item?.appointments));
  const appointments = flatten(patientsWithAppts.map(item => item.appointments));

  if (size(appointments)) {
    const exactMatch = [];
    const partialMatch = [];
    patientsWithAppts.forEach((patient) => {
      patient.appointments.forEach((appointment) => {
        matchPatient(patient, params, appointment, requestData, exactMatch, partialMatch);
      });
    });

    if (size(exactMatch)) {
      const selectedApp = exactMatch[0];
      const name = `${selectedApp.patient.firstName} ${selectedApp.patient.lastName}`;

      const patientModel = patients.find(patient => patient.id === selectedApp.patientId);
      const patientUserId = patientUser.id;
      const modifiedPatient = {
        ...patientModel,
        patientUserId,
      };
      dispatch(
        updateEntityRequest({
          key: 'patients',
          values: modifiedPatient,
          url: `/api/patients/${modifiedPatient.id}`,
        }),
      );

      dispatch(
        updateEntityRequest({
          url: `/api/requests/${requestData.requestId}/confirm/${selectedApp.id}`,
          values: {},
          alert: alertRequestUpdate(name),
        }),
      );
    } else if (size(partialMatch)) {
      set(cloneRequestData, 'nextAppt', appointments);
      dispatch(selectAppointment(cloneRequestData));
    }
  } else if (apptWrite) {
    dispatch(
      setMergingPatient({
        patientUser,
        requestData: cloneRequestData,
        suggestions: patients,
      }),
    );
    return patients;
  }
  dispatch(selectAppointment(cloneRequestData));

  return patients;
}

const suggestionParams = (patientUser, requestData) => ({
  firstName: patientUser.get('firstName'),
  lastName: patientUser.get('lastName'),
  email: patientUser.get('email'),
  mobilePhoneNumber: patientUser.get('phoneNumber'),
  birthDate: patientUser.get('birthDate'),
  requestCreatedAt: requestData.createdAt,
});

function alertRequestUpdate(name) {
  return {
    success: { body: `Request updated and Email confirmation sent to ${name}` },
    error: { body: `Request update failed for ${name} Failed` },
  };
}

function lower(str) {
  return `${str}`.toLowerCase().trim();
}
function matchPatient(patient, params, appointment, requestData, exactMatch, partialMatch) {
  const { firstName } = params;
  const score = matchPatientScore(patient, params);
  if (
    inRangeOf(4, 'hours', appointment, requestData)
    && firstName
    && lower(firstName) === lower(patient.firstName)
  ) {
    if (score >= 3) {
      exactMatch.push({
        ...appointment,
        patient,
      });
    } else if (score >= 2) {
      partialMatch.push({ ...appointment });
    }
  } else if (inRangeOf(6, 'months', appointment, requestData) && score >= 2) {
    partialMatch.push({ ...appointment });
  }
}

function matchPatientScore(patient, params) {
  let score = 0;
  if (lower(params.firstName) && lower(params.firstName) === lower(patient.firstName)) {
    score += 1;
  }
  if (lower(params.lastName) && lower(params.lastName) === lower(patient.lastName)) {
    score += 1;
  }
  const phones = [
    patient.homePhoneNumber,
    patient.mobilePhoneNumber,
    patient.otherPhoneNumber,
    patient.workPhoneNumber,
    patient.cellPhoneNumber,
    patient.phoneNumber,
  ];
  if (params.mobilePhoneNumber && phones.includes(params.mobilePhoneNumber)) {
    score += 1;
  }
  const birthday = patient.birthDate?.slice(0, 10);
  const requestBirthday = params.birthDate?.slice(0, 10);
  if (requestBirthday && requestBirthday === birthday) {
    score += 1;
  }
  return score;
}

function inRangeOf(range, unit, appointment, requestData) {
  const apptStart = getUTCDate(appointment.startDate);
  const requestStart = getUTCDate(requestData.startDate);
  return Math.abs(apptStart.diff(requestStart, unit, true)) <= range;
}

export function setAllFilters(entityKeys) {
  return function (dispatch, getState) {
    const { entities } = getState();

    entityKeys.forEach((key) => {
      const model = entities.getIn([key, 'models']);

      let filterModel = [];
      if (key === 'services') {
        const practitioners = entities.getIn(['practitioners', 'models']);

        practitioners.forEach((practitioner) => {
          const practitionerIds = practitioner.get('services');

          practitionerIds.forEach((serviceId) => {
            if (practitionerIds.indexOf(serviceId) > -1) {
              filterModel.push(model.get(serviceId));
            }
          });
        });
      } else {
        filterModel = model;
      }
      dispatch(
        addAllScheduleFilter({
          key: `${key}Filter`,
          entities: filterModel,
        }),
      );
    });
  };
}

function getEntities(entities) {
  const data = [];
  each(entities, (collectionMap) => {
    each(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}
