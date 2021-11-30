import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const countAllNotActionedSubmissions = gql`
  query countAllNotActionedSubmissions($practiceId: String!) {
    countAllNotActionedSubmissions(practiceId: $practiceId)
  }
`;
