
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'react-popover';
import moment from 'moment-timezone';
import classNames from 'classnames';
import 'react-day-picker/lib/style.css';
import { capitalize } from '@carecru/isomorphic';
import RDayPicker from 'react-day-picker';
import Input from '../Input';
import { dayPickerTheme } from './defaultTheme';
import { StyleExtender } from '../../Utils/Themer';
import Button from '../Button';
import { DropdownSelect } from '../index';
import styles from './styles.scss';

const subtractDays = (days) => {
  const result = new Date();
  result.setDate(result.getDate() - days);
  result.setHours(0);
  return result;
};

const subtractMonths = (months) => {
  const result = new Date();
  result.setMonth(result.getMonth() - months);
  result.setHours(0);
  return result;
};

class DayPickerWithHelper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      relativeValue: 3,
      relativeUnit: 'Weeks',
      isRelative: false,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleRelativeChange = this.handleRelativeChange.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleRelativeChange() {
    const dayWithTimezone = moment
      .tz(new Date(), this.props.timezone)
      .add(this.state.relativeValue, this.state.relativeUnit)
      .toISOString();
    this.props.onChange(dayWithTimezone);
  }

  handleDayClick(day, { disabled }) {
    if (disabled) {
      return;
    }

    this.setState({ isRelative: false });
    const sanitizedDate = moment(day).toObject();
    const value = moment.tz(sanitizedDate, this.props.timezone).toISOString();
    this.props.onChange(value);
    this.setState({ isOpen: false });
  }

  togglePopOver() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      isRelative: false,
      relativeValue: 3,
      relativeUnit: 'Weeks',
    }));
  }

  handleInputChange({ target }) {
    this.props.onChange(target.value);
  }

  handleClose({ key }) {
    if (key === 'Tab' || key === 'Enter' || key === 'Escape') {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { tipSize, timezone, value, theme, helpersList } = this.props;

    const sanitizedDate = moment(value).toObject();
    const displayValue = value && moment.tz(sanitizedDate, this.props.timezone).format('l');

    const body = (
      <div className={styles.outerContainer}>
        <div className={styles.helpersContainer}>
          <div className={styles.helpersWrapper}>
            {helpersList.map(item => (
              <Button
                key={item.label}
                className={styles.helperButton}
                onClick={() => this.handleDayClick(item.value, { disabled: false })}
              >
                {capitalize(item.label)}
              </Button>
            ))}
            <Button
              className={classNames(styles.helperButton, {
                [styles.activeButton]: this.state.isRelative,
              })}
              onClick={() =>
                this.setState(
                  prevState => ({ isRelative: !prevState.isRelative }),
                  () => this.handleRelativeChange(),
                )
              }
            >
              Relative
            </Button>
          </div>
          <RDayPicker
            onDayClick={this.handleDayClick}
            selectedDays={moment.tz(value, timezone).toDate()}
            handleInputChange={this.handleInputChange}
            initialMonth={value ? moment.tz(value, timezone).toDate() : new Date()}
            month={value ? moment.tz(value, timezone).toDate() : new Date()}
            classNames={StyleExtender(
              { ...dayPickerTheme,
container: styles.calendarContainer },
              theme,
            )}
            {...this.props}
          />
        </div>
        {this.state.isRelative && (
          <div className={styles.helperFooter}>
            <span className={styles.helperLabel}>Relative Date</span>
            <div className={styles.helperFieldsWrapper}>
              <Input
                type="number"
                value={this.state.relativeValue}
                onChange={e =>
                  this.setState({ relativeValue: e.target.value }, () =>
                    this.handleRelativeChange())
                }
              />
              <DropdownSelect
                value={this.state.relativeUnit}
                onChange={relativeUnit =>
                  this.setState({ relativeUnit }, () => this.handleRelativeChange())
                }
                options={[
                  { value: 'Days' },
                  { value: 'Weeks' },
                  { value: 'Months' },
                  { value: 'Years' },
                ]}
              />
            </div>
          </div>
        )}
      </div>
    );

    return (
      <Popover
        preferPlace="below"
        className={styles.zIndex}
        onOuterAction={this.togglePopOver}
        isOpen={this.state.isOpen}
        tipSize={tipSize}
        body={[body]}
      >
        <div>
          <Input
            theme={theme}
            value={displayValue}
            label={this.props.label}
            onChange={e => e.preventDefault()}
            onKeyDown={e => this.handleClose(e)}
            onFocus={this.togglePopOver}
          />
        </div>
      </Popover>
    );
  }
}

DayPickerWithHelper.propTypes = {
  onChange: PropTypes.func,
  timezone: PropTypes.string.isRequired,
  tipSize: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  theme: PropTypes.objectOf(PropTypes.string),
  label: PropTypes.string,
  helpersList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.instanceOf(Date),
    }),
  ),
};

DayPickerWithHelper.defaultProps = {
  onChange: e => e,
  tipSize: 12,
  label: '',
  value: '',
  theme: {},
  helpersList: [
    {
      label: 'Yesterday',
      value: subtractDays(1),
    },
    {
      label: 'Last Week',
      value: subtractDays(7),
    },
    {
      label: 'Last Month',
      value: subtractMonths(1),
    },
    {
      label: '3 Months Ago',
      value: subtractMonths(3),
    },
    {
      label: 'Last Year',
      value: subtractMonths(12),
    },
  ],
};

export default DayPickerWithHelper;
