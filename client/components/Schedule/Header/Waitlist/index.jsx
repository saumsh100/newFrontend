
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Map } from 'immutable';
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
          const patient = edge.node.patient
            ? {
              ...edge.node.patient,
              clientId: edge.node.patient.id,
              id: edge.node.patient.ccId,
            }
            : undefined;

          const patientUser = edge.node.patientUser
            ? {
              ...edge.node.patientUser,
              clientId: edge.node.patient.id,
              id: edge.node.patientUser.ccId,
            }
            : undefined;

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
            })}
          >
            {!isHub() && (
              <div className={styles.header}>
                {waitSpots.length} {waitSpots.length === 1 ? 'Patient' : 'Patients'} on Waitlist
                <div className={styles.addTo}>
                  <Button color="blue" onClick={openAddTo} data-test-id="button_addToWaitlist">
                    Add to Waitlist
                  </Button>
                </div>
              </div>
            )}
            <List className={styles.list}>
              {waitSpots.sort(SortByCreatedAtDesc).map((waitSpot, index, arr) => {
                let patientData = null;
                let isPatientUser = false;

                if (waitSpot.patientUserId && !waitSpot.patientId) {
                  patientData = waitSpot.patientUser;
                  isPatientUser = true;
                } else if (waitSpot.patientId) {
                  patientData = waitSpot.patient;
                }

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

Waitlist.propTypes = {
  waitSpots: PropTypes.instanceOf(Map),
  patientUsers: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  removeWaitSpot: PropTypes.func.isRequired,
  openAddTo: PropTypes.func.isRequired,
  selectWaitSpot: PropTypes.func,
  selectedWaitSpots: PropTypes.arrayOf(PropTypes.string),
};

Waitlist.defaultProps = {
  waitSpots: Map,
  patientUsers: Map,
  patients: Map,
};
