import { gql } from '@apollo/client';
// eslint-disable-next-line import/prefer-default-export
export const subscribeSubmissionNotifications = gql`
  subscription {
    submissionNotification {
      count
      event
      date
      practiceId
    }
  }
`;
