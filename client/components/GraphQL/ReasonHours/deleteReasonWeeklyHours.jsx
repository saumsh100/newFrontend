
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation deleteReasonWeeklyHours_NEST($reasonWeeklyHoursId: ID!) {
    deleteReasonWeeklyHours(reasonWeeklyHoursDeleteInput: { id: $reasonWeeklyHoursId }) {
      id
    }
  }
`;
