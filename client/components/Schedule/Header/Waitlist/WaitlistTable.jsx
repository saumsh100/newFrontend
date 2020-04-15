
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';
import { isHub } from '../../../../util/hub';
import { Button, List, SHeader } from '../../../library';
import todoStyles from '../../../Dashboard/DonnaToDoListContainer/Tasks/styles.scss';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import WaitListItem from './WaitListItem';
import waitSpotShape from '../../../library/PropTypeShapes/waitSpotShape';

const WaitlistTable = ({
  removeWaitSpot,
  openAddTo,
  selectWaitSpot,
  selectedWaitSpots,
  waitlist,
}) => (
  <div
    className={classNames(styles.waitList, {
      [styles.hubWrapper]: isHub(),
      [styles.withSelectedElements]: isHub() && selectedWaitSpots.length > 0,
    })}
  >
    {!isHub() && (
      <div className={styles.header}>
        <span data-test-id="waitListLength">{waitlist.length}</span>
        &nbsp;
        {waitlist.length === 1 ? 'Patient' : 'Patients'} on Waitlist
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
      {waitlist.sort(SortByCreatedAtDesc).map((waitSpot, index, arr) => {
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

WaitlistTable.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.shape(waitSpotShape)).isRequired,
  removeWaitSpot: PropTypes.func.isRequired,
  openAddTo: PropTypes.func.isRequired,
  selectWaitSpot: PropTypes.func.isRequired,
  selectedWaitSpots: PropTypes.arrayOf(PropTypes.string),
};

WaitlistTable.defaultProps = {
  selectedWaitSpots: [],
};

export default WaitlistTable;
