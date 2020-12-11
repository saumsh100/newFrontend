
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Fetch as FetchWaitlist,
  AddWaitSpotSubscription,
  RemoveWaitSpotSubscription,
} from '../../../GraphQLWaitlist';
import graphqlRefetcher from '../../../../util/graphqlRefetcher';
import LoadingBar from '../../../library/LoadingBar';
import WaitlistTable from './WaitlistTable';
import NextWaitlist from './NextWaitlist';
import styles from './styles.scss';

const WaitlistGQLEnhanced = ({ newWaitlist, accountId, ...props }) => {
  const [isLoading, setLoadingState] = useState(true);
  return (
    <FetchWaitlist newWaitlist={newWaitlist}>
      {({ data: waitSpotData, subscribeToMore, refetch }) => {
        if (waitSpotData && waitSpotData.accountViewer) {
          setLoadingState(false);
        }

        const refetcher = graphqlRefetcher(subscribeToMore, refetch, { accountId });
        refetcher(AddWaitSpotSubscription);
        refetcher(RemoveWaitSpotSubscription);

        const waitSpots = !isLoading
          ? waitSpotData.accountViewer.waitSpots.edges
              .map((edge) => {
                const patient = edge.node.patient && {
                  ...edge.node.patient,
                  clientId: edge.node.patient.id,
                  id: edge.node.patient.ccId,
                };

                const patientUser = edge.node.patientUser && {
                  ...edge.node.patientUser,
                  clientId: edge.node.patientUser.id,
                  id: edge.node.patientUser.ccId,
                };

                return {
                  ...edge.node,
                  clientId: edge.node.id,
                  id: edge.node.ccId,
                  accountViewerClientId: waitSpotData.accountViewer.id,
                  patient,
                  patientUser,
                };
              })
              .filter(
                ({ patient, patientUser }) =>
                  // if both are null, the wait spot is invalid
                  patient !== null || patientUser !== null,
              )
          : [];

        const nextWaitList = isLoading ? (
          <LoadingBar className={styles.loadingBarOverride} />
        ) : (
          <NextWaitlist waitlist={waitSpots} {...props} />
        );
        return newWaitlist ? nextWaitList : <WaitlistTable waitlist={waitSpots} {...props} />;
      }}
    </FetchWaitlist>
  );
};

WaitlistGQLEnhanced.propTypes = {
  accountId: PropTypes.string.isRequired,
  newWaitlist: PropTypes.bool.isRequired,
  toggleWaitlist: PropTypes.func,
};

WaitlistGQLEnhanced.defaultProps = {
  toggleWaitlist: () => {},
};

export default memo(WaitlistGQLEnhanced);
