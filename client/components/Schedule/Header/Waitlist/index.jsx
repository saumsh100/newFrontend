
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Fetch as FetchWaitlist,
  AddWaitSpotSubscription,
  RemoveWaitSpotSubscription,
} from '../../../GraphQLWaitlist';
import graphqlRefetcher from '../../../../util/graphqlRefetcher';
import WaitlistTable from './WaitlistTable';
import NextWaitlist from './NextWaitlist';

const WaitlistGQLEnhanced = ({ newWaitlist, accountId, ...props }) => (
  <FetchWaitlist newWaitlist={newWaitlist}>
    {({ data: waitSpotData, subscribeToMore, refetch }) => {
      if (!waitSpotData || !waitSpotData.accountViewer) {
        return null;
      }
      const refetcher = graphqlRefetcher(subscribeToMore, refetch, { accountId });
      refetcher(AddWaitSpotSubscription);
      refetcher(RemoveWaitSpotSubscription);

      const waitSpots = waitSpotData.accountViewer.waitSpots.edges.map((edge) => {
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
      });

      return newWaitlist ? (
        <NextWaitlist waitlist={waitSpots} {...props} />
      ) : (
        <WaitlistTable waitlist={waitSpots} {...props} />
      );
    }}
  </FetchWaitlist>
);

WaitlistGQLEnhanced.propTypes = {
  accountId: PropTypes.string.isRequired,
  newWaitlist: PropTypes.bool.isRequired,
  toggleWaitlist: PropTypes.func.isRequired,
};

export default memo(WaitlistGQLEnhanced);
