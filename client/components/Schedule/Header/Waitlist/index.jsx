
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Fetch as FetchWaitlist,
  AddWaitSpotSubscription,
  RemoveWaitSpotSubscription,
} from '../../../GraphQLWaitlist';
import graphqlRefetcher from '../../../../util/graphqlRefetcher';
import WaitlistTable from './WaitlistTable';
import NextWaitlist from './NextWaitlist';
import DraftMessage from './WaitlistMessage/DraftMessage';
import ResponseMessage from './WaitlistMessage/ResponseMessage';

export const WAITLIST_STATE = {
  initial: 0,
  draft: 1,
  sent: 2,
};

const WaitlistGQLEnhanced = ({ newWaitlist, accountId, toggleWaitlist, ...props }) => {
  const [waitlistState, setWaitListState] = useState(WAITLIST_STATE.draft);
  const [textMessage, setTextMessage] = useState(
    'Hello, this is Sunshine Smiles Dental. We had an opening recently become available on [DATE] at [TIME]. Would like us to schedule you in for this time?',
  );
  return (
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

        const WaitList = newWaitlist ? (
          <NextWaitlist waitlist={waitSpots} {...props} />
        ) : (
          <WaitlistTable waitlist={waitSpots} {...props} />
        );

        switch (waitlistState) {
          case WAITLIST_STATE.initial:
            return WaitList;

          case WAITLIST_STATE.draft:
            return (
              <DraftMessage
                toggleWaitlist={toggleWaitlist}
                setWaitListState={setWaitListState}
                textMessage={textMessage}
                setTextMessage={setTextMessage}
              />
            );

          case WAITLIST_STATE.sent:
            return (
              <ResponseMessage
                toggleWaitlist={toggleWaitlist}
                setWaitListState={setWaitListState}
                textMessage={textMessage}
              />
            );

          default:
            return WaitList;
        }
      }}
    </FetchWaitlist>
  );
};

WaitlistGQLEnhanced.propTypes = {
  accountId: PropTypes.string.isRequired,
  newWaitlist: PropTypes.bool.isRequired,
  toggleWaitlist: PropTypes.func.isRequired,
};

export default WaitlistGQLEnhanced;
