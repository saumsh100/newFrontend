
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

/**
 * The default format for the value key must be
 * ISOString ("YYYY-MM-DDTHH:mm:ss.sssZ")
 *
 * @param value {String}
 * @param timezone {String}
 */
const formatTimeField = (value, timezone) => {
  const time = moment.tz(value, ['LT', 'HH:mm:ss.SSS[Z]'], true, timezone);
  return time.isValid() && time.format('HH:mm:ss.SSS[Z]');
};
/**
 * The default format for the label kry must be
 * LT ("HH:MM A|PM").
 *
 */
const renderTimeValue = (value, timezone) => {
  const time = moment.tz(value, 'HH:mm:ss.SSS[Z]', true, timezone);
  return time.isValid() && time.format('LT');
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
        error={error}
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
          error={error}
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
    {error && (
      <span className={styles.errorMessage}>The Start Time must be before the End Time</span>
    )}
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
  error: PropTypes.bool,
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
