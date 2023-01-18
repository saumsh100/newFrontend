import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { Loading, ErrorBadge } from '..';

export const gqlQueryFetchIsPoc = gql`
  query fetchIsPocStatus($patientId: String!) {
    accountViewer {
      id
      patient(id: $patientId) {
        id
        firstName
        lastName
        isEmailPoc
        isPhonePoc
      }
    }
  }
`;

const gqlQuery = (patientId) => gql`
    query fetchIsPocStatus {
        accountViewer {
            id
            patient(id: "${patientId}") {
                id
                firstName
                lastName
                isEmailPoc
                isPhonePoc
            }
        }
    }
`;

/**
 * Queries the patient with the provided patient Id
 * pass down the queried data to the children render prop.
 * Can also receive a shouldShowLoading prop, defaults to false, if showing a loading is desired.
 * @param {*} props.patientId
 * @param {*} props.children
 * @param {*} props.shouldShowLoading
 */
const PatientQueryRenderer = ({ patientId, children, shouldShowLoading }) => (
  <Query query={gqlQuery(patientId)}>
    {({ loading, error, data }) => {
      if (shouldShowLoading && loading) return <Loading />;
      if (error) {
        console.error('-- PatientQueryRenderer', error.message);
        return <ErrorBadge />;
      }

      return children(data);
    }}
  </Query>
);

PatientQueryRenderer.propTypes = {
  patientId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  shouldShowLoading: PropTypes.bool,
};

PatientQueryRenderer.defaultProps = { shouldShowLoading: false };

export default PatientQueryRenderer;
