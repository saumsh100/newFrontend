import { useQuery } from '@apollo/client';
import { countAllNotActionedSubmissions } from '../GraphQL/FormNotifications/GetNotificationCount';
import { formsClient } from './clientConfig';

const useGetNotificationsCount = (practiceId) => {
  return useQuery(countAllNotActionedSubmissions, {
    variables: {
      practiceId,
    },
    client: formsClient,
  });
};

// eslint-disable-next-line import/prefer-default-export
export { useGetNotificationsCount };
