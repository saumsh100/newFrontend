
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
  
const getTokenDefault = () => localStorage.getItem('token');

const fetchQuery = (getToken = getTokenDefault) => (operation, variables) => {
  const token = getToken();

  return fetch('/graphql', {
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
