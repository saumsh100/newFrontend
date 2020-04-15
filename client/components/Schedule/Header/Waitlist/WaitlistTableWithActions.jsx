
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Checkbox, DropdownMenu, Icon } from '../../../library';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import WaitlistRow from './WaitlistRow';
import { propsGenerator } from './helpers';
import styles from './tableStyles.scss';

const WaitlistTableWithActions = ({ waitlist, openAddTo, timezone }) => (
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
            <Button {...props} color="white" border="blue" className={styles.headerButtons}>
              Actions <Icon icon="caret-down" size={0.8} type="solid" />
            </Button>
          )}
          className={styles.headerButtons}
        >
          <Button className={styles.actionItem} onClick={() => this.toggleAction('isTesting')}>
            Send Mass Text
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
            <Checkbox checked={false} onChange={console.log} />
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
          <WaitlistRow {...propsGenerator(props, timezone)} />
        ))}
      </tbody>
    </table>
  </div>
);

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(WaitlistTableWithActions);

WaitlistTableWithActions.propTypes = {
  openAddTo: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

WaitlistTableWithActions.defaultProps = {
  waitlist: [],
};
