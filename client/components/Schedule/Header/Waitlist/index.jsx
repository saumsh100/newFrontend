
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import WaitListItem from './WaitListItem';
import { List, Button } from '../../../library';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import styles from './styles.scss';

export default function Waitlist(props) {
  const {
    waitSpots, patientUsers, patients, removeWaitSpot, openAddTo,
  } = props;

  return (
    <div className={styles.waitList}>
      <div className={styles.header}>
        {waitSpots.size} {waitSpots.size === 1 ? 'Patient' : 'Patients'} on Waitlist
        <div className={styles.addTo}>
          <Button color="blue" onClick={openAddTo} data-test-id="button_addToWaitlist">
            Add to Waitlist
          </Button>
        </div>
      </div>
      <List className={styles.list}>
        {waitSpots
          .sort(SortByCreatedAtDesc)
          .toArray()
          .map((waitSpot, index, arr) => {
            let patientData = null;
            let isPatientUser = false;

            if (waitSpot.patientUserId && !waitSpot.patientId) {
              patientData = patientUsers.get(waitSpot.patientUserId);
              isPatientUser = true;
            } else if (waitSpot.patientId) {
              patientData = patients.get(waitSpot.patientId);
            }

            let removeBorder = false;
            if (index === arr.length - 1 && arr.length > 1) {
              removeBorder = true;
            }

            return (
              <WaitListItem
                key={`waitSpot_${waitSpot.id}`}
                waitSpot={waitSpot}
                patient={patientData}
                removeWaitSpot={() => {
                  removeWaitSpot(waitSpot.id);
                }}
                isPatientUser={isPatientUser}
                removeBorder={removeBorder}
              />
            );
          })}
      </List>
    </div>
  );
}

Waitlist.propTypes = {
  waitSpots: PropTypes.instanceOf(Map),
  patientUsers: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  removeWaitSpot: PropTypes.func.isRequired,
  openAddTo: PropTypes.func.isRequired,
};

Waitlist.defaultProps = {
  waitSpots: Map,
  patientUsers: Map,
  patients: Map,
};
