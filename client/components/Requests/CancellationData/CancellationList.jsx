import React, { useState } from 'react';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import TimeFrameSetting from './TimeFrameSetting';
import styles from './styles.scss';
import { List, Icon, StandardButton as Button } from '../../library';
import CancellationListItem from './CancellationListItem';
import AccountModel from '../../../entities/models/Account';

const CancellationList = (props) => {
  const [time, setTime] = useState(false);
  const { timezone, accountId, Account, role } = props;

  const cancellationTime = Account?.cancellationListTimeFrame;

  const setTimeFrame = () => {
    setTime(true);
  };
  const setOuterTime = () => {
    setTime(false);
  };
  const renderCancellationList = () => {
    return (
      <>
        <div className={styles.timeFrameContainer}>
          <span className={styles.timeFrameText}>
            Time Frame: {cancellationTime} business day before appt.
          </span>
          <Popover
            className={styles.timeFramePopOver}
            place="below"
            isOpen={time}
            body={
              <TimeFrameSetting
                key="123"
                accountId={accountId}
                setTime={setTime}
                setCancellationList={props.setCancellationList}
                role={role}
                setLoading ={props.setLoading}
              />
            }
            onOuterAction={setOuterTime}
          >
            <Button
              className={styles.timeFrameButton}
              data-testid="advanced-settings-button"
              variant="secondary"
              onClick={setTimeFrame}
            >
              <Icon icon="fa fa-cog" type="solid" />
            </Button>
          </Popover>
        </div>

        <List className={styles.cancellationList}>
          {props.cancellationList.length !== 0 ? (
            props.cancellationList.map((cancellation) => {
              const { startDate, endDate, patient, practitioner, id } = cancellation;

              return (
                <CancellationListItem
                  startDate={startDate}
                  endDate={endDate}
                  timezone={timezone}
                  unit={cancellation.unit}
                  patient={patient}
                  Practitioner={practitioner}
                  sendText={cancellation.sendText}
                  key={id}
                  cancellationListId={id}
                  setCancellationList={props.setCancellationList}
                  accountId={accountId}
                  setLoading = {props.setLoading}
                />
              );
            })
          ) : (
            <div className={styles.noCancellation}>
              There are no Cancellations within the selected Time Frame
            </div>
          )}
        </List>
      </>
    );
  };
  return <>{renderCancellationList()}</>;
};
CancellationList.propTypes = {
  timezone: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
  Account: PropTypes.instanceOf(AccountModel).isRequired,
};

function mapStateToProps({ auth, schedule, entities }) {
  return {
    timezone: auth.get('timezone'),
    role: auth.get('role'),
    accountId: auth.get('accountId'),
    timeFrame: schedule.get('timeFrame'),
    Account: entities.getIn(['accounts', 'models', auth.get('accountId')]).toJS(),
  };
}

const enhance = connect(mapStateToProps);

export default enhance(CancellationList);
