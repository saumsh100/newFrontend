
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Service from '../../../../../entities/models/Service';
import { getRangeOfDays } from '../../../../../../server/util/time';
import { setWaitlistDates } from '../../../../../actions/availabilities';
import { Button, DayPickerRange, Input } from '../../../../library';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

function SelectDates({
  selectedService,
  history,
  selectedAvailability,
  timezone,
  setWaitlist,
  waitlist,
  location,
}) {
  /**
   * Extracts dates on a date-range and also set these date to the reducer.
   *
   * @param {*} param0
   */
  const extractRange = ({ from, to }) => {
    const dates = from && to ? getRangeOfDays(from, to, timezone) : [];
    return setWaitlist(dates);
  };

  /**
   * Checks if there are a specific route to go onclicking a card or just the default one.
   */
  const contextualUrl = (location.state && location.state.nextRoute) || './select-times';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>Waitlist Summary</h3>
        <p className={styles.subtitle}>
          Here are the informations that you already defined to your
          appointment.
        </p>
        <p className={styles.waitlistIndex}>
          <span className={styles.waitlistKey}>Reason</span>
          <span className={styles.waitlistValue}>
            {selectedService.get('name')}
            <Button
              className={styles.editLink}
              onClick={() =>
                history.push({
                  pathname: '../reason',
                  state: { nextRoute: './waitlist/select-dates' },
                })
              }
            >
              <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
              </svg>
            </Button>
          </span>
        </p>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Select Dates</h3>
        <p className={styles.subtitle}>
          Select the first and last day of your availability. You will be able
          to customize your schedule later.
        </p>
        <DayPickerRange
          fieldsWrapper={dayPickerFields}
          from={
            (waitlist.dates.length && moment(waitlist.dates[0]).toDate()) || ''
          }
          to={
            (waitlist.dates.length &&
              moment(waitlist.dates[waitlist.dates.length - 1]).toDate()) ||
            ''
          }
          disabledDays={{
            before: new Date(),
            after:
              (selectedAvailability &&
                moment(selectedAvailability.startDate).toDate()) ||
              null,
          }}
          onChange={values => extractRange(values)}
        />
        <Button
          disabled={!waitlist.dates.length}
          className={`${styles.fullWidthButton} ${styles.dateRangeButton}`}
          onClick={() => history.push(contextualUrl)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const dayPickerFields = ({
  from: {
    fromReadOnly, fromValue, fromRef, fromOnClick,
  },
  to: {
    toReadOnly, toValue, toRef, toOnClick,
  },
}) => (
  <div className={styles.rangeInputContainer}>
    <Input
      readOnly={fromReadOnly}
      refCallBack={fromRef}
      value={fromValue}
      onClick={fromOnClick}
      label="Start Date"
      theme={{
        inputWithIcon: styles.inputWithIcon,
        iconClassName: styles.validationIcon,
        erroredLabelFilled: styles.erroredLabelFilled,
        input: styles.input,
        filled: styles.filled,
        label: styles.label,
        group: styles.inputsGroup,
        error: styles.error,
        erroredInput: styles.erroredInput,
        bar: styles.bar,
        erroredLabel: styles.erroredLabel,
      }}
    />
    <Input
      readOnly={toReadOnly}
      refCallBack={toRef}
      value={toValue}
      onClick={toOnClick}
      label="End Date"
      theme={{
        inputWithIcon: styles.inputWithIcon,
        iconClassName: styles.validationIcon,
        erroredLabelFilled: styles.erroredLabelFilled,
        input: styles.input,
        filled: styles.filled,
        label: styles.label,
        group: styles.inputsGroup,
        error: styles.error,
        erroredInput: styles.erroredInput,
        bar: styles.bar,
        erroredLabel: styles.erroredLabel,
      }}
    />
  </div>
);

dayPickerFields.propTypes = {
  from: PropTypes.shape({
    fromReadOnly: PropTypes.bool,
    fromValue: PropTypes.string,
    fromRef: PropTypes.func,
    fromOnClick: PropTypes.func,
  }).isRequired,
  to: PropTypes.shape({
    toReadOnly: PropTypes.bool,
    toValue: PropTypes.string,
    toRef: PropTypes.func,
    toOnClick: PropTypes.func,
  }).isRequired,
};

function mapStateToProps({ availabilities, entities }) {
  return {
    timezone: availabilities.get('account').get('timezone'),
    waitlist: availabilities.get('waitlist').toJS(),
    selectedAvailability:
      availabilities.get('confirmedAvailability') &&
      availabilities.get('selectedAvailability'),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWaitlist: setWaitlistDates,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectDates);

SelectDates.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  timezone: PropTypes.string.isRequired,
  setWaitlist: PropTypes.func.isRequired,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
  selectedAvailability: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      endDate: PropTypes.string,
      practitionerId: PropTypes.string,
      startDate: PropTypes.string,
    }),
  ]),
  selectedService: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Service),
  ]),
};
SelectDates.defaultProps = {
  waitlist: { dates: [], unavailableDates: [], times: [] },
  selectedAvailability: false,
  selectedService: '',
};
