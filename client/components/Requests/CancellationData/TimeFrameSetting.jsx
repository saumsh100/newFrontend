import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StandardButton as Button,
  Card,
  Icon,
  Tooltip,
  SContainer,
  DropdownSelect,
} from '../../library';
import styles from './styles.scss';
import { updateTimeFrame, cancellationListItem } from './thunks';
import { updateEntity } from '../../../reducers/entities';

function TimeFrameSetting(props) {
  const { accountId, setTime, setCancellationList, role, setLoading, cancellationTime } = props;
  const [timeFrameValue, setTimeFrameValue] = useState(cancellationTime);

  const dropDownOptionValue = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 11, value: 11 },
    { label: 12, value: 12 },
    { label: 13, value: 13 },
    { label: 14, value: 14 },
  ];

  const updateValue = async () => {
    if (timeFrameValue !== null) {
      setLoading(true);
      await updateTimeFrame(accountId, timeFrameValue).then(({ data }) => {
        if (data.entities) {
          setTime(false);
          props.updateEntity({
            key: 'accounts',
            entity: data,
          });
          cancellationListItem(accountId).then(({ data }) => {
            setCancellationList(data);
            setLoading(false);
          });
        }
      });
    }
  };

  return (
    <Card className={styles.formContainer} noBorder>
      <SContainer>
        <div className={styles.header}>
          Cancellation Time frame:
          <Tooltip
            trigger={['hover']}
            overlay={
              <div className={styles.tooltipWrapper}>
                <div className={styles.tooltipBodyRow}>
                  This is how far in the future we will notify&nbsp;&nbsp;&nbsp;&nbsp;<br />you of appointment cancellations
                </div>
              </div>
            }
            placement="top"
          >
            <span>
              <Icon className={styles.circleIcon} icon="question-circle" size={0.9} />
            </span>
          </Tooltip>
        </div>
        <div className={styles.body}>
          {
            role === 'OWNER' || role === 'SUPERADMIN' ? (
              <DropdownSelect
                className={styles.dropdown}
                align="left"
                options={dropDownOptionValue}
                value={
                  timeFrameValue === null ? <span className={styles.select}>2</span> : timeFrameValue
                }
                label={timeFrameValue === null ? '2' : ''}
                required
                onChange={(graph) => {
                  setTimeFrameValue(graph);
                }}
                theme={{
                  wrapper: styles.wrapper,
                  toggleDiv: styles.toggleDiv,
                  label: styles.label,
                  activeIcon: styles.activeIcon,
                }}
              />
            ) : (
              <DropdownSelect
                className={styles.dropdown}
                align="left"
                label={timeFrameValue === null ? '2' : ''}
                required
                theme={{
                  wrapper: styles.wrapper,
                  toggleDiv: styles.disabledToggleDiv,
                  label: styles.label,
                  caretIconWrapper: styles.caretIconWrapper,
                  caretIcon: styles.activeIcon,
                }}
              />
            )}
          <span className={styles.timeFrameText}>business day before appt.</span>
          <Button
            variant={timeFrameValue !== cancellationTime ? 'primary' : 'disabled'}
            className={styles.applyButton}
            onClick={updateValue}
          >
            <Icon icon="check" className={styles.check} />
            Apply
          </Button>
        </div>
      </SContainer>
    </Card>
  );
}
TimeFrameSetting.propTypes = {
  accountId: PropTypes.string.isRequired,
  setTime: PropTypes.func.isRequired,
  setCancellationList: PropTypes.func.isRequired,
  updateEntity: PropTypes.func.isRequired,
};

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateEntity,
    },
    dispatch,
  );

const enhance = connect(null, dispatchToProps);
export default enhance(TimeFrameSetting);
