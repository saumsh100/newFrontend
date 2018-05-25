
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { isOnDevice, getApiUrl } from './hub';

const getTokenDefault = () => localStorage.getItem('token');
const path = '/graphql';

const url = !isOnDevice() ? path : getApiUrl() + path;

const fetchQuery = (getToken = getTokenDefault) => (operation, variables) => {
  const token = getToken();

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json());
};

const environment = new Environment({
  network: Network.create(fetchQuery()),
  store: new Store(new RecordSource()),
});

export default environment;
