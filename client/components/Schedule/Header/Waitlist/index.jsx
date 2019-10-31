
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import WaitListItem from './WaitListItem';
import { List, Button, SHeader } from '../../../library';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import { isHub } from '../../../../util/hub';
import {
  Fetch as FetchWaitlist,
  AddWaitSpotSubscription,
  RemoveWaitSpotSubscription,
} from '../../../GraphQLWaitlist';
import graphqlRefetcher from '../../../../util/graphqlRefetcher';
import waitSpotShape from '../../../library/PropTypeShapes/waitSpotShape';
import styles from './styles.scss';
import todoStyles from '../../../Dashboard/DonnaToDoListContainer/Tasks/styles.scss';

const Waitlist = ({ removeWaitSpot, openAddTo, selectWaitSpot, selectedWaitSpots, waitSpots }) => (
  <div
    className={classNames(styles.waitList, {
      [styles.hubWrapper]: isHub(),
      [styles.withSelectedElements]: isHub() && selectedWaitSpots.length > 0,
    })}
  >
    {!isHub() && (
      <div className={styles.header}>
        <span data-test-id="waitListLength">{waitSpots.length}</span>
        &nbsp;
        {waitSpots.length === 1 ? 'Patient' : 'Patients'} on Waitlist
        <div className={styles.addTo}>
          <Button color="blue" onClick={openAddTo} data-test-id="button_addToWaitlist">
            Add to Waitlist
          </Button>
        </div>
      </div>
    )}

    <SHeader className={styles.tableHeader}>
      <div className={styles.colAvater} />
      <div className={todoStyles.col}>Patient</div>
      <div className={todoStyles.col}>Days</div>
      <div className={todoStyles.col}>Times</div>
      <div className={todoStyles.col}>Next Appt</div>
      <div className={styles.colDel} />
    </SHeader>

    <List className={styles.list}>
      {waitSpots.sort(SortByCreatedAtDesc).map((waitSpot, index, arr) => {
        if (!waitSpot.patientUserId && !waitSpot.patientId) return null;

        const patientData = waitSpot.patientId ? waitSpot.patient : waitSpot.patientUser;
        const isPatientUser = !!waitSpot.patientUserId;
        const removeBorder = arr.length > 1 && index === arr.length - 1;
        return (
          <WaitListItem
            key={`waitSpot_${waitSpot.id}`}
            waitSpot={waitSpot}
            patient={patientData}
            removeWaitSpot={() => {
              removeWaitSpot(waitSpot);
            }}
            isPatientUser={isPatientUser}
            removeBorder={removeBorder}
            onSelect={() => {
              selectWaitSpot(waitSpot.id);
            }}
            selected={selectedWaitSpots && selectedWaitSpots.includes(waitSpot.id)}
          />
        );
      })}
    </List>
  </div>
);

Waitlist.defaultProps = {
  selectedWaitSpots: [],
  selectWaitSpot: () => {},
};

Waitlist.propTypes = {
  waitSpots: PropTypes.arrayOf(PropTypes.shape(waitSpotShape)).isRequired,
  removeWaitSpot: PropTypes.func.isRequired,
  openAddTo: PropTypes.func.isRequired,
  selectWaitSpot: PropTypes.func,
  selectedWaitSpots: PropTypes.arrayOf(PropTypes.string),
};

const WaitlistGQLEnhanced = ({ accountId, ...props }) => (
  <FetchWaitlist>
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
      return <Waitlist waitSpots={waitSpots} {...props} />;
    }}
  </FetchWaitlist>
);

WaitlistGQLEnhanced.propTypes = { accountId: PropTypes.string.isRequired };

export default WaitlistGQLEnhanced;
