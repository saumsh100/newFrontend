
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import {
  appointmentStatsAction,
} from '../actions/stats';

export default function appointmentStats(params) {
  return function (dispatch, getState) {

    const url = '/api/appointments/stats';

    return axios
      .get(url)
      .then(({ data }) => {
        return dispatch(appointmentStatsAction(data));
      })
      .catch((err) => {
        throw err;
      });
  };
}
