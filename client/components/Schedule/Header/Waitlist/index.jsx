
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import WaitListItem from './WaitListItem';
import { List, Button } from '../../../library';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import { isHub } from '../../../../util/hub';
import { Fetch as RelayFetchWaitlist } from '../../../RelayWaitlist';
import styles from './styles.scss';

export default function Waitlist(props) {
  const { removeWaitSpot, openAddTo, selectWaitSpot, selectedWaitSpots } = props;

  return (
    <RelayFetchWaitlist
      render={(relayProps) => {
        if (relayProps.props === null) {
          return null;
        }

        const waitSpots = relayProps.props.accountViewer.waitSpots.edges.map((edge) => {
          const patient = edge.node.patient && {
            ...edge.node.patient,
            clientId: edge.node.patient.id,
            id: edge.node.patient.ccId,
          };

          const patientUser = edge.node.patientUser && {
            ...edge.node.patientUser,
            clientId: edge.node.patient.id,
            id: edge.node.patientUser.ccId,
          };

          return {
            ...edge.node,
            clientId: edge.node.id,
            id: edge.node.ccId,
            accountViewerClientId: relayProps.props.accountViewer.id,
            patient,
            patientUser,
          };
        });

        return (
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
            <List className={styles.list}>
              {waitSpots.sort(SortByCreatedAtDesc).map((waitSpot, index, arr) => {
                if (!waitSpot.patientUserId && !waitSpot.patientId) {
                  return null;
                }

                const patientData = waitSpot.patientId ? waitSpot.patient : waitSpot.patientUser;
                const isPatientUser = !!waitSpot.patientId;
                const removeBorder = index === arr.length - 1 && arr.length > 1;

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
                    selected={selectedWaitSpots && selectedWaitSpots.indexOf(waitSpot.id) > -1}
                  />
                );
              })}
            </List>
          </div>
        );
      }}
    />
  );
}

Waitlist.defaultProps = {
  selectedWaitSpots: [],
  selectWaitSpot: () => {},
};

Waitlist.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
  openAddTo: PropTypes.func.isRequired,
  selectWaitSpot: PropTypes.func,
  selectedWaitSpots: PropTypes.arrayOf(PropTypes.string),
};
