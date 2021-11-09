import { gql } from '@apollo/client';

export default gql`
  mutation deleteReasonWeeklyHours_NEST($reasonWeeklyHoursId: ID!) {
    deleteReasonWeeklyHours(reasonWeeklyHoursDeleteInput: { id: $reasonWeeklyHoursId }) {
      id
    }
  }
`;
