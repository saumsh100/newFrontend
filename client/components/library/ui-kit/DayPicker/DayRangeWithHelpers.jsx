
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import classnames from 'classnames';
import Calendar from '../Icons/Calendar';
import ui from '../../../../ui-kit.scss';
import styles from './styles.scss';
import PopoverConfirm from '../Button/PopoverConfirm';
import PopoverCancel from '../Button/PopoverCancel';
import GhostButton from '../Button/GhostButton';

class DayRangeWithHelpers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClickWrapper = this.handleClickWrapper.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick({ target }) {
    if (!this.containerEl.contains(target) && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  handleClickWrapper({ target }) {
    if (!this.state.isOpen) {
      return this.setState({ isOpen: true });
    }

    if (!(target === this.fromInput || target === this.toInput)) {
      return this.setState({ isOpen: false });
    }
  }

  render() {
    const { label, showOutsideDays } = this.props;
    const modifiers = {
      [styles.start]: new Date(2019, 3, 1),
      [styles.end]: new Date(2019, 3, 25),
    };
    return (
      <div>
        <div
          ref={(div) => {
            this.containerEl = div;
          }}
        >
          {label && <p className={ui.fieldLabel}>{label}</p>}
          <div className={styles.wrapper}>
            <div
              className={classnames(styles.dayRangeInputWrapper, {
                [styles.active]: this.state.isOpen,
              })}
              role="button"
              tabIndex={0}
              onKeyDown={({ keyCode }) =>
                keyCode === 13 && this.setState(prevState => ({ isOpen: !prevState.isOpen }))
              }
              onClick={this.handleClickWrapper}
            >
              <strong>Next 3 Months</strong>
              <input
                type="text"
                value="September 30, 2019"
                ref={(div) => {
                  this.fromInput = div;
                }}
              />
              -
              <input
                type="text"
                value="September 30, 2019"
                ref={(div) => {
                  this.toInput = div;
                }}
              />
              <Calendar />
            </div>
            <div
              className={classnames(styles.dayRangeWrapper, { [styles.active]: this.state.isOpen })}
            >
              <div className={styles.main}>
                <div className={styles.helpersWrapper}>
                  <GhostButton onClick={console.log}>Yesterday</GhostButton>
                  <GhostButton onClick={console.log}>This Week</GhostButton>
                  <GhostButton onClick={console.log}>This Month</GhostButton>
                  <GhostButton onClick={console.log}>This Year</GhostButton>
                </div>
                <DayPicker
                  onDayClick={console.log}
                  showOutsideDays={showOutsideDays}
                  classNames={{
                    container: styles.dayPickerContainer,
                    day: styles.singleDay,
                    navBar: styles.navBar,
                    navButtonPrev: styles.navButtonPrev,
                    navButtonNext: styles.navButtonNext,
                    outside: styles.outsideDay,
                    selected: styles.selectedDay,
                  }}
                  selectedDays={[
                    new Date(2019, 3, 1),
                    {
                      from: new Date(2019, 3, 1),
                      to: new Date(2019, 3, 25),
                    },
                  ]}
                  modifiers={modifiers}
                  handleInputChange={console.log}
                  initialMonth={new Date()}
                  month={new Date()}
                />
              </div>
              <div className={styles.footer}>
                <PopoverCancel>Cancel</PopoverCancel>
                <PopoverConfirm>Apply</PopoverConfirm>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DayRangeWithHelpers.propTypes = {
  label: PropTypes.string,
  showOutsideDays: PropTypes.bool,
};

DayRangeWithHelpers.defaultProps = { label: '',
  showOutsideDays: true };

export default DayRangeWithHelpers;
