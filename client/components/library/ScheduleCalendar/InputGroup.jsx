
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classNames from 'classnames';
import DropdownTimeSuggestion from '../DropdownTimeSuggestion';
import { dropdownTheme } from '../../Widget/theme';
import { DeleteIcon } from './Icons';
import styles from './modal.scss';
import schedule from './schedule.scss';
import { Button } from '../index';

export const isTimeValid = (value, timezone) => {
  const time = moment.tz(value, ['LT', 'HH:mm:ss.SSS[Z]'], true, timezone);
  return time.isValid();
};

/**
 * The default format for the value key must be
 * ISOString ("YYYY-MM-DDTHH:mm:ss.sssZ")
 *
 * @param value {String}
 * @param timezone {String}
 */
const formatTimeField = (value, timezone) => {
  const time = moment.tz(value, ['LT', 'HH:mm:ss.SSS[Z]'], true, timezone);
  return isTimeValid(value, timezone) ? time.format('HH:mm:ss.SSS[Z]') : value;
};
/**
 * The default format for the label kry must be
 * LT ("HH:MM A|PM").
 *
 */
const renderTimeValue = (value, timezone) => {
  const time = moment.tz(value, 'HH:mm:ss.SSS[Z]', true, timezone);
  return isTimeValid(value, timezone) ? time.format('LT') : value;
};

const InputGroup = ({
  timezone,
  startTime,
  endTime,
  isAllow,
  timeOptions,
  onChange,
  isRemovable,
  onClick,
  showEndTime,
  error,
  theme,
  renderList = undefined,
}) => (
  <div className={styles.inputGroup}>
    <div className={styles.inputs}>
      <DropdownTimeSuggestion
        options={timeOptions}
        key="startTime"
        onChange={value => onChange({ startTime: value })}
        value={startTime}
        renderValue={value => renderTimeValue(value, timezone)}
        formatValue={value => formatTimeField(value, timezone)}
        disabled={!isAllow}
        error={error.inputStart}
        strict={false}
        renderList={renderList}
        theme={theme}
      />
      {showEndTime && [
        <span className={styles.spacer}>to</span>,
        <DropdownTimeSuggestion
          options={timeOptions}
          key="endTime"
          renderList={renderList}
          onChange={value => onChange({ endTime: value })}
          value={endTime}
          renderValue={value => renderTimeValue(value, timezone)}
          formatValue={value => formatTimeField(value, timezone)}
          strict={false}
          disabled={!isAllow}
          error={error.inputEnd}
          theme={theme}
        />,
      ]}
      {isRemovable && (
        <Button
          className={classNames(styles.delete, { [styles.disabled]: !isAllow })}
          disabled={!isAllow}
          onClick={onClick}
        >
          <DeleteIcon />
        </Button>
      )}
    </div>
    {error.inputGroup && <span className={styles.errorMessage}>{error.inputGroup}</span>}
  </div>
);

export default InputGroup;

InputGroup.propTypes = {
  endTime: PropTypes.string.isRequired,
  isAllow: PropTypes.bool.isRequired,
  isRemovable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  startTime: PropTypes.string.isRequired,
  timeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  renderList: PropTypes.func.isRequired,
  theme: PropTypes.objectOf(PropTypes.string),
  error: PropTypes.shape({
    inputGroup: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
    inputStart: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
    inputEnd: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  }),
  showEndTime: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

InputGroup.defaultProps = {
  isRemovable: false,
  showEndTime: true,
  theme: dropdownTheme(schedule),
  error: '',
  onClick: () => {},
};
