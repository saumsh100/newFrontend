
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Checkbox, DropdownMenu, Icon } from '../../../library';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import WaitlistRow from './WaitlistRow';
import { propsGenerator } from './helpers';
import styles from './tableStyles.scss';

const WaitlistTableWithActions = ({
  waitlist,
  openAddTo,
  toggleAllWaitlistSelection,
  isEveryWaitlistSelected,
  isAnyWaitlistSelected,
  removeMultipleWaitSpots,
  ...parentProps
}) => (
  <div className={styles.waitList}>
    <div className={styles.headerTable}>
      <h3>
        {waitlist.length}
        &nbsp;
        {`Patient${waitlist.length !== 1 ? 's' : ''}`} on Waitlist
      </h3>
      <div className={styles.addTo}>
        <DropdownMenu
          labelComponent={props => (
            <Button
              {...props}
              color="white"
              border="blue"
              disabled={!isAnyWaitlistSelected}
              className={styles.headerButtons}
            >
              Actions <Icon icon="caret-down" size={0.8} type="solid" />
            </Button>
          )}
          className={styles.headerButtons}
        >
          <Button className={styles.actionItem} onClick={() => console.log}>
            Send Mass Text
          </Button>
          <Button className={styles.actionItem} onClick={removeMultipleWaitSpots}>
            Delete
          </Button>
        </DropdownMenu>
        <Button
          color="blue"
          className={styles.headerButtons}
          onClick={openAddTo}
          data-test-id="button_addToWaitlist"
        >
          Add to Waitlist
        </Button>
      </div>
    </div>
    <table className={styles.patients}>
      <thead>
        <tr>
          <th width={20} />
          <th data-width="sm">
            <Checkbox checked={isEveryWaitlistSelected} onChange={toggleAllWaitlistSelection} />
          </th>
          <th>Date Added</th>
          <th>Patient</th>
          <th>Reason</th>
          <th data-width="sm">Units</th>
          <th>Days</th>
          <th>Times</th>
          <th>Notes</th>
          <th>Next Appt</th>
          <th data-width="sm">Manage</th>
          <th width={20} />
        </tr>
      </thead>
      <tbody>
        {waitlist.sort(SortByCreatedAtDesc).map(props => (
          <WaitlistRow
            {...propsGenerator({
              ...props,
              ...parentProps,
            })}
          />
        ))}
      </tbody>
    </table>
  </div>
);

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(WaitlistTableWithActions);

WaitlistTableWithActions.propTypes = {
  openAddTo: PropTypes.func.isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  isEveryWaitlistSelected: PropTypes.bool.isRequired,
  isAnyWaitlistSelected: PropTypes.bool.isRequired,
  toggleAllWaitlistSelection: PropTypes.func.isRequired,
  removeMultipleWaitSpots: PropTypes.func.isRequired,
};

WaitlistTableWithActions.defaultProps = {
  waitlist: [],
};
