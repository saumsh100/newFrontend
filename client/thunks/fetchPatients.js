import axios from 'axios';

export  function postPatient( patient ) {
  return (dispatch, getState) => {
    const { firstName, lastName, phoneNumber } = patient;
    axios.post('/api/patients', patient)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }
};

export function updatePatient( patient ) {
  return (dispatch, getState) => {
    const { firstName, lastName, phoneNumber } = patient;
    axios.put(`/api/patients/${patient.id}`, patient)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }
};

export function deletePatient( patient ) {
  return (dispatch, getState) => {
    axios.delete(`/api/patients/${patient.id}`)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }
};
