
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Checkbox, DropdownMenu, Icon } from '../../../library';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import WaitlistRow from './WaitlistRow';
import { propsGenerator } from './helpers';
import styles from './tableStyles.scss';

const WaitlistTableWithActions = ({
  waitlist,
  selectedWaitlistMap,
  setSelectedWaitlistMap,
  removeMultipleWaitSpots,
  batchUpdate,
  goToSendMassMessage,
  goToAddWaitListForm,
  ...parentProps
}) => {
  const waitlistLength = waitlist.length;
  const selectedWaitlistIds = Object.entries(selectedWaitlistMap)
    .filter(([, v]) => v)
    .map(([v]) => v);
  const selectedWaitlistLength = selectedWaitlistIds.length;
  const isEveryWaitlistSelected = waitlistLength > 0 && waitlistLength === selectedWaitlistLength;
  const isAnyWaitlistSelected = selectedWaitlistLength > 0;
  const toggleAllWaitlistSelection = () => {
    setSelectedWaitlistMap(batchUpdate(!isEveryWaitlistSelected));
  };

  const toggleSingleWaitlistSelection = (key) => {
    setSelectedWaitlistMap(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <div className={styles.waitList}>
      <div className={styles.headerTable}>
        <h3>
          {waitlistLength}
          &nbsp;
          {`Patient${waitlistLength !== 1 ? 's' : ''}`} on Waitlist
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
            <Button
              className={styles.actionItem}
              onClick={() => {
                goToSendMassMessage(selectedWaitlistIds);
              }}
            >
              Send Mass Text
            </Button>
            <Button
              className={styles.actionItem}
              onClick={() => removeMultipleWaitSpots({ ids: selectedWaitlistIds })}
            >
              Delete
            </Button>
          </DropdownMenu>
          <Button
            color="blue"
            className={styles.headerButtons}
            onClick={goToAddWaitListForm}
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
            <th data-width="xs">
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
                toggleSingleWaitlistSelection,
                selectedWaitlistMap,
              })}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default memo(connect(mapStateToProps)(WaitlistTableWithActions));

WaitlistTableWithActions.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  selectedWaitlistMap: PropTypes.objectOf(PropTypes.bool).isRequired,
  removeMultipleWaitSpots: PropTypes.func.isRequired,
  setSelectedWaitlistMap: PropTypes.func.isRequired,
  goToSendMassMessage: PropTypes.func.isRequired,
  batchUpdate: PropTypes.func.isRequired,
  goToAddWaitListForm: PropTypes.func.isRequired,
};

WaitlistTableWithActions.defaultProps = {
  waitlist: [],
};
