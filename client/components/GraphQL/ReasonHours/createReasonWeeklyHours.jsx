import { gql } from '@apollo/client';

export default gql`
  mutation createReasonWeeklyHours_NEST($accountId: String!, $reasonId: String!, $date: String!) {
    createReasonWeeklyHours(
      reasonWeeklyHoursCreateInput: {
        accountId: $accountId
        reasonId: $reasonId
        mondayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
        tuesdayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
        wednesdayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
        thursdayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
        fridayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
        saturdayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
        sundayHours: {
          accountId: $accountId
          date: $date
          breaks: []
          availabilities: []
          isClosed: false
        }
      }
    ) {
      id
    }
  }
`;
