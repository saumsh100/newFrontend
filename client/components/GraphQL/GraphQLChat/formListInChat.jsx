import React from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { formsClient } from '../../GraphQLForms/clientConfig';

const query = gql`
  query getPractice($practiceId: String!) {
    getPractice(practiceId: $practiceId) {
      practiceId
      name
      email
      organizationId
      forms {
        formId
        slug
        name
        longUrl
        shortUrl
        enable
        __typename
      }
      createdAt
      updatedAt
      deletedAt
      __typename
    }
  }
`;

const ListPracticesForms = ({ children, practiceId }) => (
  <Query query={query} variables={{ practiceId }} client={formsClient}>
    {children}
  </Query>
);

ListPracticesForms.propTypes = {
  children: PropTypes.func,
  practiceId: PropTypes.string.isRequired,
};

ListPracticesForms.defaultProps = {
  children: null,
};

export default ListPracticesForms;
