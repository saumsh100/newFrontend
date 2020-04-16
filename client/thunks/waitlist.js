
import { dateFormatter } from '@carecru/isomorphic';
import { fetchEntities } from './fetchEntities';
import { httpClient } from '../util/httpClient';

export const loadWeeklySchedule = () => dispatch =>
  dispatch(
    fetchEntities({
      key: 'accounts',
      join: ['weeklySchedule'],
    }),
  );

export const loadMassTextTemplate = ({ timezone, id, name }) => {
  const url =
    `/api/accounts/${id}/renderedTemplate` +
    '?templateName=waitlist-mass-text-message' +
    `&parameters[date]=${dateFormatter(new Date(), timezone, 'MMMM Do YYYY')}` +
    `&parameters[time]=${dateFormatter(new Date(), timezone, 'h:mm a')}` +
    `&parameters[account][name]=${name}`;

  return httpClient().get(url);
};

export const waitlistRecipientsAnalyzer = (accountId, waitspotIds) =>
  httpClient().get('/api/waitlist/sms/success', {
    params: {
      waitspotIds,
      accountId,
    },
  });

export const sendMassMessage = (accountId, waitspotIds, message) =>
  httpClient().post('/api/waitlist/sms', {
    waitspotIds,
    accountId,
    message,
  });
