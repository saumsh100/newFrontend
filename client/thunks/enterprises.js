import axios from 'axios';

const base = '/enterprises'

export const getEnterprises = () =>
  axios.get(`${base}`);
