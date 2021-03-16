
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { week, frames, capitalize } from '../../../../../util/isomorphic';
import {
  Grid,
  Row,
  Col,
  Avatar,
  Icon,
  Button,
  DialogBox,
  getUTCDate,
  getTodaysDate,
} from '../../../../library/index';
import { Create as CreateWaitSpot } from '../../../../GraphQLWaitlist';
import { isHub } from '../../../../../util/hub';
import CheckboxButton from '../../../../library/CheckboxButton';
import { availabilitiesGroupedByPeriod } from '../../../../Widget/Booking/Review/helpers';
import PatientSearch from '../../../../PatientSearch';
import { loadWeeklySchedule } from '../../../../../thunks/waitlist';
import Loading from '../../../../library/Loading';
import styles from './styles.scss';

const timeFrameOptions = ['morning', 'afternoon', 'evening'];

const initialState = {
  patientSearched: null,
  availableTimes: [],
  daysOfTheWeek: week.all.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: false,
    }),
    {},
  ),
  fetched: false,
};

/**
 * Component that displays a selected patient,
 * the user can unassign it simply clicking on it
 *
 * @param handleAutoSuggest
 * @param patientSearched
 * @returns {*}
 * @constructor
 */
export const SelectedPatient = ({ handleAutoSuggest, patientSearched, className, avatarSize }) => (
  <div
    className={classNames(styles.patientContainer, className)}
    onClick={() => handleAutoSuggest(null)}
    role="button"
    onKeyDown={({ keyCode }) => keyCode === 13 && handleAutoSuggest(null)}
    tabIndex="0"
  >
    <Avatar user={patientSearched} size={avatarSize} />
    <div className={styles.patientContainer_name}>
      {patientSearched.firstName} {patientSearched.lastName}
    </div>
    <div className={styles.patientContainer_icon}>
      <Icon icon="search" />
    </div>
  </div>
);

class AddToWaitlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.closeModal = this.closeModal.bind(this);
    this.getAllTimes = this.getAllTimes.bind(this);
    this.getTimeFrameArray = this.getTimeFrameArray.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
    this.handleCheckboxTime = this.handleCheckboxTime.bind(this);
    this.handleCreateWaitSpot = this.handleCreateWaitSpot.bind(this);
    this.hasEveryDateSelected = this.hasEveryDateSelected.bind(this);
    this.hasEveryTimeSelected = this.hasEveryTimeSelected.bind(this);
    this.toggleDateFrames = this.toggleDateFrames.bind(this);
    this.toggleTimeFrames = this.toggleTimeFrames.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  /**
   * In order to display the availableTimes we need to make sure
   * that we have the account's weeklySchedule in place.
   */
  componentDidMount() {
    this.props.loadWeeklySchedule();
    this.setState({ fetched: true });
  }

  /**
   * As soon as we have the officeHours information,
   * let's analyze it and update the component's state.
   */
  componentDidUpdate() {
    if (!this.state.fetched) {
      this.props.loadWeeklySchedule();
    }
  }

  /**
   * Get all times available
   *
   * @returns {Array}
   */
  getAllTimes() {
    return timeFrameOptions
      .map(t => this.getTimeFrameArray(t))
      .reduce((acc, curr) => [...acc, ...curr], []);
  }

  /**
   * With the provided timeframe, return an array with only startDate.
   * @param timeframe
   * @returns {Array}
   */
  getTimeFrameArray(timeframe) {
    return this.props.availabilities[timeframe].map(({ startDate }) => startDate);
  }

  /**
   * Check if every time on the timeFrameArray is included into the selected availableTimes array.
   *
   * @param times {Array}
   * @returns {Boolean}
   */
  hasEveryTimeSelected(times) {
    return times.every(t => this.state.availableTimes.includes(t));
  }

  /**
   * Update the searchedPatient, you can clean the selection
   * or add a new patient object.
   *
   * @param newValue
   */
  handleAutoSuggest(newValue) {
    this.setState({
      patientSearched:
        'id' in newValue
          ? {
            avatarUrl: newValue.avatarUrl,
            firstName: newValue.firstName,
            id: newValue.id,
            lastName: newValue.lastName,
          }
          : null,
    });
  }

  /**
   * Join the provided data to create a new Waitspot,
   * after this reinitialize the state + close the dialogBox
   */
  handleCreateWaitSpot() {
    const { patientSearched, daysOfTheWeek, availableTimes } = this.state;
    const { createWaitSpotHandler, timezone } = this.props;
    if (
      !patientSearched
      || Object.values(daysOfTheWeek).every(a => !a)
      || availableTimes.length === 0
    ) {
      return;
    }
    createWaitSpotHandler({
      variables: {
        input: {
          daysOfTheWeek,
          availableTimes,
          patientId: patientSearched.id,
          endDate: getTodaysDate(timezone)
            .add(30, 'days')
            .toISOString(),
          accountId: this.props.accountId,
        },
      },
    });

    this.reinitializeState();
    this.props.toggleModal();
  }

  /**
   * Reset the state
   */
  reinitializeState() {
    this.setState({
      ...initialState,
      fetched: true,
    });
  }

  /**
   * Checks if every provided date is already selected.
   *
   * @param dates
   */
  hasEveryDateSelected(dates) {
    return (
      Object.entries(this.state.daysOfTheWeek).filter(([k, v]) => dates.includes(k) && v).length
      === dates.length
    );
  }

  /**
   * With provided dates, toggle their actual state.
   *
   * @param dates
   * @returns {*}
   */
  toggleDateFrames(dates) {
    const daysOfTheWeek = dates.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: !this.hasEveryDateSelected(dates),
      }),
      this.state.daysOfTheWeek,
    );
    return this.setState({ daysOfTheWeek });
  }

  /**
   * Check the state of the provided time,
   * if it's unselected we select it,
   * otherwise unselect it.
   *
   * @param time {String}
   */
  handleCheckboxTime(time) {
    const availableTimes = this.state.availableTimes.includes(time)
      ? [...this.state.availableTimes.filter(a => a !== time)]
      : [...this.state.availableTimes, time];
    this.setState({ availableTimes });
  }

  /**
   * Toggle a frame of times, but first check if there's any time already selected.
   *
   * @param timeframe {Array}
   */
  toggleTimeFrames(timeframe) {
    const availableTimes = this.hasEveryTimeSelected(timeframe)
      ? this.state.availableTimes.filter(t => !timeframe.includes(t))
      : [...new Set([...this.state.availableTimes, ...timeframe])];
    return this.setState({ availableTimes });
  }

  /**
   * Tooggle the Modal off and also reinitialize the state.
   */
  closeModal() {
    this.reinitializeState();
    this.props.toggleModal();
  }

  render() {
    const { availabilities, active, timezone } = this.props;
    const { patientSearched, availableTimes, daysOfTheWeek } = this.state;
    const disabled = !patientSearched
      || Object.values(daysOfTheWeek).every(a => !a)
      || availableTimes.length === 0;
    return (
      <DialogBox
        custom
        title="Add to Waitlist"
        active={active}
        onEscKeyDown={this.closeModal}
        onOverlayClick={this.closeModal}
        bodyStyles={styles.dialogBodyAdd}
        actions={[
          {
            props: { border: 'blue' },
            component: Button,
            onClick: this.closeModal,
            label: 'Cancel',
          },
          {
            props: {
              disabled,
              color: 'blue',
              'data-test-id': 'button_submitForm',
            },
            component: Button,
            onClick: this.handleCreateWaitSpot,
            label: 'Save',
          },
        ]}
      >
        {!availabilities ? (
          <Loading />
        ) : (
          <div className={classNames({ [styles.responsiveFormWrapper]: isHub() })}>
            <Grid className={styles.addToContainer}>
              <Row className={styles.searchContainer} data-test-id="patientWrapper">
                <Col xs={12} md={12}>
                  {patientSearched ? (
                    <SelectedPatient
                      handleAutoSuggest={this.handleAutoSuggest}
                      patientSearched={patientSearched}
                    />
                  ) : (
                    <PatientSearch
                      data-test-id="patientData"
                      onSelect={this.handleAutoSuggest}
                      theme={{ container: styles.patientSearchClass }}
                      inputProps={{
                        classStyles: styles.patientSearchInput,
                        placeholder: 'Add Patient',
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12} className={styles.subHeaderMargin}>
                  Preferred Days of the Week
                </Col>
              </Row>
              <Row className={styles.dayContainer}>
                {Object.values(frames).map(f => (
                  <div className={styles.colFrames} key={f}>
                    <CheckboxButton
                      labelStyles={styles.checkboxButton}
                      wrapperStyle={styles.wrapperCheckboxButton}
                      checked={this.hasEveryDateSelected(week[f])}
                      label={capitalize(f)}
                      onChange={() => this.toggleDateFrames(week[f])}
                    />
                  </div>
                ))}
              </Row>
              <div className={styles.orWrapper}>Or</div>
              <Row className={styles.dayContainer}>
                {week.all.map(day => (
                  <div className={styles.colSpacing} key={day}>
                    <CheckboxButton
                      data-test-id={day}
                      labelStyles={styles.checkboxButton}
                      wrapperStyle={styles.wrapperCheckboxButton}
                      checked={daysOfTheWeek[day]}
                      label={capitalize(day)}
                      onChange={() =>
                        this.setState(prevState => ({
                          daysOfTheWeek: {
                            ...prevState.daysOfTheWeek,
                            [day]: !prevState.daysOfTheWeek[day],
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </Row>
              <Row>
                <Col xs={12} className={styles.subHeaderMargin}>
                  Preferred Times
                </Col>
              </Row>
              <Row className={styles.dayContainer}>
                <div className={styles.colFrames}>
                  <CheckboxButton
                    data-test-id="all"
                    labelStyles={styles.checkboxButton}
                    wrapperStyle={styles.wrapperCheckboxButton}
                    checked={availabilities.total === availableTimes.length}
                    label="All day"
                    onChange={() => this.toggleTimeFrames(this.getAllTimes())}
                  />
                </div>
                {timeFrameOptions
                  .filter(v => availabilities[v].length)
                  .map(timeframe => (
                    <div className={styles.colFrames} key={timeframe}>
                      <CheckboxButton
                        labelStyles={styles.checkboxButton}
                        wrapperStyle={styles.wrapperCheckboxButton}
                        checked={this.hasEveryTimeSelected(this.getTimeFrameArray(timeframe))}
                        label={capitalize(timeframe)}
                        onChange={() => this.toggleTimeFrames(this.getTimeFrameArray(timeframe))}
                      />
                    </div>
                  ))}
              </Row>
              <div className={styles.orWrapper}>Or</div>
              {timeFrameOptions
                .filter(v => availabilities[v].length)
                .map(t => (
                  <Row className={styles.timeFrameContainer} key={t}>
                    {availabilities[t].map(({ startDate }) => (
                      <div className={styles.colSpacing} key={startDate}>
                        <CheckboxButton
                          labelStyles={styles.checkboxButton}
                          wrapperStyle={styles.wrapperCheckboxButton}
                          checked={availableTimes.includes(startDate)}
                          label={getUTCDate(startDate, timezone).format('LT')}
                          onChange={() => this.handleCheckboxTime(startDate)}
                        />
                      </div>
                    ))}
                  </Row>
                ))}
            </Grid>
          </div>
        )}
      </DialogBox>
    );
  }
}
const mapStateToProps = ({ auth, availabilities, entities }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    activeAccount.get('weeklyScheduleId'),
  ]);

  const availabilitiesGrouped = weeklySchedule
    && activeAccount
    && availabilitiesGroupedByPeriod(
      Object.values(weeklySchedule.toJS()),
      activeAccount.get('timezone'),
      60,
    );

  return {
    availabilities: availabilitiesGrouped,
    accountId: auth.get('accountId'),
    timezone: activeAccount.get('timezone'),
    waitSpot: availabilities.get('waitSpot'),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ loadWeeklySchedule }, dispatch);

const AddToWaitlistEnhanced = connect(mapStateToProps, mapDispatchToProps)(AddToWaitlist);

AddToWaitlist.defaultProps = {
  active: false,
  timezone: '',
  availabilities: null,
};

AddToWaitlist.propTypes = {
  active: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired,
  loadWeeklySchedule: PropTypes.func.isRequired,
  createWaitSpotHandler: PropTypes.func.isRequired,
  timezone: PropTypes.string,
  availabilities: PropTypes.shape({
    evening: PropTypes.arrayOf(
      PropTypes.shape({
        endDate: PropTypes.string,
        startDate: PropTypes.string,
      }),
    ),
    afternoon: PropTypes.arrayOf(
      PropTypes.shape({
        endDate: PropTypes.string,
        startDate: PropTypes.string,
      }),
    ),
    morning: PropTypes.arrayOf(
      PropTypes.shape({
        endDate: PropTypes.string,
        startDate: PropTypes.string,
      }),
    ),
    total: PropTypes.number,
  }),
};

SelectedPatient.propTypes = {
  avatarSize: PropTypes.string,
  className: PropTypes.string,
  handleAutoSuggest: PropTypes.func.isRequired,
  patientSearched: PropTypes.shape({
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

SelectedPatient.defaultProps = {
  avatarSize: 'sm',
  className: '',
};

const CreateWaitSpotWrapper = props =>
  props.active && (
    <CreateWaitSpot>
      {createWaitSpotHandler => (
        <AddToWaitlistEnhanced createWaitSpotHandler={createWaitSpotHandler} {...props} />
      )}
    </CreateWaitSpot>
  );

CreateWaitSpotWrapper.propTypes = {
  active: PropTypes.bool,
};

CreateWaitSpotWrapper.defaultProps = {
  active: false,
};

export default CreateWaitSpotWrapper;
