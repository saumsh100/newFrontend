import { httpClient } from '../../../util/httpClient';

export  const updateTimeFrame = (accountId, value) =>
  httpClient().put(`/api/accounts/${accountId}`, {
    cancellationListTimeFrame: value,
  });

export  const cancellationListItem = (accountId) =>
  httpClient().get(`/api/cancellationsNotFilled/${accountId}/cancellationsList`);
