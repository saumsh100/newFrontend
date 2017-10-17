
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import 'moment-timezone';
import classNames from 'classnames';
// import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Grid,
  Row,
  Col,
  IconButton,
  Icon,
} from '../../../../library';
import * as Actions from '../../../../../actions/availabilities';
import * as Thunks from '../../../../../thunks/availabilities';
import styles from './styles.scss';

const getSortedAvailabilities = (momentDate, availabilities, accountTimezone) => {
  // TODO: This could be sped up, we can assume availabilities are in order
  return availabilities.filter((a) => {
    return accountTimezone ? moment.tz(a.startDate, accountTimezone).isSame(momentDate, 'd')
    : moment(a.startDate).isSame(momentDate, 'd');
  });
  // return filteredAvailabilities.sort((a, b) => moment(a).diff(b));
};

function CaretButton(props) {
  const name = `${props.direction}CaretButton`;
  const classes = classNames(props.className, styles[name]);
  return <div {...props} className={classes} />;
}

class AvailabilitiesDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      scrollDown: true,
    };

    this.setDateBack = this.setDateBack.bind(this);
    this.setDateForward = this.setDateForward.bind(this);
    this.jumpToNext = this.jumpToNext.bind(this);
    this.debounceFetchAvailabilities = debounce(this.debounceFetchAvailabilities, 500);
    this.scrollY = this.scrollY.bind(this);
    this.desktopContainerDidMount = this.desktopContainerDidMount.bind(this);
  }

  componentWillMount() {
    this.props.fetchAvailabilities();
  }

  componentWillReceiveProps(nextProps) {
    const shouldFetchAvailabilities = (nextProps.selectedPractitionerId !== this.props.selectedPractitionerId) ||
                                      (nextProps.selectedServiceId !== this.props.selectedServiceId) ||
                                      (nextProps.selectedStartDate !== this.props.selectedStartDate);

    if (shouldFetchAvailabilities) {
      this.setState({ fetching: true });
      this.debounceFetchAvailabilities();
    }
  }

  setDateBack(numDays = 4) {
    const newStartDate = moment(this.props.selectedStartDate).subtract(numDays, 'days').toISOString();
    this.props.setSelectedStartDate(newStartDate);
  }

  setDateForward(numDays = 4) {
    const newStartDate = moment(this.props.selectedStartDate).add(numDays, 'days').toISOString();
    this.props.setSelectedStartDate(newStartDate);
  }

  jumpToNext(startDate) {
    const newStartDate = moment(startDate).subtract(2, 'hours').toISOString();
    this.props.setSelectedStartDate(newStartDate);
  }

  debounceFetchAvailabilities() {
    this.props.fetchAvailabilities()
      .then(() => this.setState({ fetching: false }));
  }

  scrollY() {
    const n = this.desktopContainer;
    const padding = 20;
    console.log(n.scrollHeight, n.scrollTop, n.offsetHeight);

    // Determine if certain padding away from bottom and if so, hide scroll
    const height = n.scrollHeight - n.offsetHeight;
    if ((height - n.scrollTop) <= padding) {
      this.setState({
        scrollDown: false,
      });
    } else {
      this.setState({
        scrollDown: true,
      });
    }
  }

  desktopContainerDidMount(node) {
    if (node) {
      this.desktopContainer = node;
      node.addEventListener('scroll', this.scrollY);
    }
  }

  render() {
    const {
      isFetching,
      availabilities,
      nextAvailability,
      selectedStartDate,
      selectedAvailability,
      setSelectedAvailability,
      account,
    } = this.props;

    const numDaysForward = 4;
    const dayAvailabilities = [];

    const accountTimezone = account.timezone;

    let i;
    for (i = 0; i <= numDaysForward; i++) {
      const momentDate = accountTimezone ?
        moment.tz(selectedStartDate, accountTimezone).add(i, 'days') :
        moment(selectedStartDate).add(i, 'days');

      const sortedAvailabilities = getSortedAvailabilities(momentDate, availabilities, accountTimezone);
      dayAvailabilities.push({ momentDate, sortedAvailabilities });
    }

    const headerClasses = classNames(styles.appointment__table_elements);
    const header = (
      <div className={headerClasses}>
        {dayAvailabilities.map((a) => {
          return (
            <ul className={styles.appointment__list} key={`${a.momentDate.toISOString()}_header`}>
              <div className={styles.appointment__list_header}>
                <div className={styles.list__header_day}>
                  {a.momentDate.format('ddd')}
                </div>
                <div className={styles.list__header_number}>
                  {a.momentDate.format('MMM Do')}
                </div>
              </div>
            </ul>
          );
        })}
      </div>
    );

    // TODO: use array.some?
    let display = false;
    for (let i = 0; i < dayAvailabilities.length; i++) {
      if (dayAvailabilities[i].sortedAvailabilities.length) {
        display = true;
        break;
      }
    }

    const needsToScrollMoreDesktop = dayAvailabilities.some(d => d.sortedAvailabilities.length > 5);
    const needsToScrollMoreMobile = dayAvailabilities[0].length > 3;

    // console.log(dayAvailabilities);
    let availabilitiesDisplay = (
      <div className={styles.displayContainer}>
        <i className={`fa fa-spinner fa-spin fa-3x fa-fw ${styles.loadingSpinnerIcon}`} />
      </div>
    );

    let mobileAvailabilitiesDisplay = (
      <div className={styles.mobileDisplayContainer}>
        <i className={`fa fa-spinner fa-spin fa-3x fa-fw ${styles.loadingSpinnerIcon}`} />
      </div>
    );

    if (!isFetching && !this.state.fetching) {
      if (display) {
        availabilitiesDisplay = (
          <div
            ref={this.desktopContainerDidMount}
            className={styles.displayAvailabilitiesContainer}
          >
            <div className={styles.appointment__table_elements}>
              {dayAvailabilities.map((a) => {
                return (
                  <ul className={styles.appointment__list} key={`${a.momentDate.toISOString()}_list`}>
                    {a.sortedAvailabilities.map((availability) => {
                      let classes = styles.appointment__list_item;
                      if (selectedAvailability && selectedAvailability.startDate === availability.startDate) {
                        classes = `${classes} ${styles.appointment__list_selected}`;
                      }

                      return (
                        <li
                          key={`${availability.startDate}_item`}
                          onClick={() => setSelectedAvailability(availability)}
                          className={classes}
                        >
                          {accountTimezone ? moment.tz(availability.startDate, accountTimezone).format('h:mm a')
                            : moment(availability.startDate).format('h:mm a')}
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
          </div>
        );

        mobileAvailabilitiesDisplay = (
          <div>
            <ul className={styles.appointmentListMobile}>
              {dayAvailabilities[0].sortedAvailabilities.map((availability) => {
                let classes = styles.appointment__list_item;
                if (selectedAvailability && selectedAvailability.startDate === availability.startDate) {
                  classes = `${classes} ${styles.appointment__list_selected}`;
                }

                return (
                  <li
                    key={`${availability.startDate}_item`}
                    onClick={() => setSelectedAvailability(availability)}
                    className={classes}
                  >
                    {accountTimezone ? moment.tz(availability.startDate, accountTimezone).format('h:mm a')
                      : moment(availability.startDate).format('h:mm a')}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      } else if (nextAvailability) {
        const { startDate } = nextAvailability;
        const mDate = accountTimezone ? moment.tz(startDate, accountTimezone) : moment(startDate);
        const displayDate = mDate.format('ddd, MMM D');
        const nextLink = (
          <li
            onClick={() => this.jumpToNext(startDate)}
            className={styles.nextAvailabilityButton}
          >
            <span>Next Availablility on</span>
            <div>{' ' + displayDate}</div>
          </li>
        );

        availabilitiesDisplay = (
          <div className={styles.displayContainer}>
            {nextLink}
          </div>
        );

        mobileAvailabilitiesDisplay = availabilitiesDisplay;
      } else {
        availabilitiesDisplay = (
          <div className={styles.displayContainer}>
            There are no available appointments
          </div>
        );

        mobileAvailabilitiesDisplay = availabilitiesDisplay;
      }
    }

    const canGoBack = moment(selectedStartDate).diff(Date.now(), 'days') > 0;

    return (
      <Grid className={styles.availabilitiesContainer}>
        <Row className={styles.desktopContainer}>
          <Col xs={1}>
            {canGoBack ?
              <CaretButton
                direction="left"
                onClick={() => this.setDateBack()}
              /> : null}
          </Col>
          <Col xs={10} className={styles.columnsWrapper}>
            <div className={styles.displayWrapperForHorizontalScroll}>
              {header}
              {availabilitiesDisplay}
              <div className={styles.scrollDownSpace}>
                {this.state.scrollDown && needsToScrollMoreDesktop ?
                  <div className={styles.scrollDown}>
                    <span>Scroll Down</span>
                    <div>
                      <Icon
                        icon="caret-down"
                      />
                    </div>
                  </div>
                : null}
              </div>
            </div>
          </Col>
          <Col xs={1}>
            <CaretButton
              direction="right"
              onClick={() => this.setDateForward()}
            />
          </Col>
        </Row>
        <Row className={styles.mobileContainer}>
          <Col xs={1}>
          </Col>
          <Col xs={10} className={styles.columnsWrapper}>
            <div className={styles.displayWrapperForHorizontalScroll}>
              {mobileAvailabilitiesDisplay}
            </div>
          </Col>
          <Col xs={1}>
          </Col>
        </Row>
      </Grid>
    );
  }

  // TODO: change Left/Right Buttons to Button elements with Icons
  // TODO: break out the availabilities component into columns and lists
}

AvailabilitiesDisplay.propTypes = {
  // startsAt: PropTypes.prop,
  availabilities: PropTypes.arrayOf(PropTypes.object),
  nextAvailability: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchAvailabilities: PropTypes.func.isRequired,
  selectedStartDate: PropTypes.string.isRequired,
  selectedPractitionerId: PropTypes.string,
  selectedServiceId: PropTypes.string.isRequired,
  selectedAvailability: PropTypes.object,
  account: PropTypes.object,
  setSelectedStartDate: PropTypes.func.isRequired,
  setSelectedAvailability: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  const account = availabilities.get('account').toJS();
  return {
    isFetching: availabilities.get('isFetching'),
    availabilities: availabilities.get('availabilities'),
    nextAvailability: availabilities.get('nextAvailability'),
    selectedStartDate: availabilities.get('selectedStartDate'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    account,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAvailabilities: Thunks.fetchAvailabilities,
    setSelectedStartDate: Actions.setSelectedStartDate,
    setSelectedAvailability: Actions.setSelectedAvailability,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailabilitiesDisplay);
