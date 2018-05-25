
import React from 'react';
import RequestsContainer from '../../../containers/RequestContainer';

const RequestsPage = () => (
  <RequestsContainer key={'scheduleRequests'} redirect={{ pathname: '/requests/schedule' }} />
);

export default RequestsPage;
