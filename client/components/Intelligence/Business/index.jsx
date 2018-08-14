
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import {
  Card,
  Col,
  Grid,
  Row,
  Button,
  ContainerList,
  Form,
  Field,
  DropdownMenu,
  Icon,
} from '../../library';
import colorMap from '../../library/util/colorMap';
import BusinessStats from './Cards/BusinessStats';
import Patients from './Cards/Patients';
import styles from './styles.scss';
import stylesOverview from '../Overview/styles.scss';
import * as Actions from '../../../actions/intelligence';

class Business extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: this.props.endDate ? this.props.endDate : moment(new Date()),
      startDate: this.props.startDate
        ? this.props.startDate
        : moment(new Date()).subtract(
          moment(new Date()).get('date') - 1,
          'days',
        ),
      compareEndDate: moment(new Date()),
      compareStartDate: moment(new Date()).subtract(
        moment(new Date()).get('date') - 1,
        'days',
      ),
      compare: false,
      loader: false,
    };

    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const startDate = this.props.startDate
      ? this.props.startDate._d
      : this.state.startDate._d;
    const endDate = this.props.endDate
      ? this.props.endDate._d
      : this.state.endDate._d;

    const params = {
      startDate,
      endDate,
      accountId: decodedToken.activeAccountId,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'callStats',
        url: '/api/calls/stats',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'appointmentStats',
        url: '/api/appointments/stats',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'businessStats',
        url: '/api/appointments/business',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'practitionerWorked',
        url: '/api/appointments/practitionerWorked',
        params,
      }),
    ]).then(() => {
      this.setState({
        startDate: moment(startDate),
        endDate: moment(endDate),
        loader: true,
      });
    });
  }

  submit(values) {
    this.setState({
      loader: false,
    });
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const params = {
      startDate: moment(values.startDate)._d,
      endDate: moment(values.endDate)._d,
      accountId: decodedToken.activeAccountId,
    };

    if (values.compare) {
      const paramsCompare = {
        startDate: moment(values.compareStartDate)._d,
        endDate: moment(values.compareEndDate)._d,
        accountId: decodedToken.activeAccountId,
      };

      Promise.all([
        this.props.fetchEntitiesRequest({
          id: 'callStatsCompare',
          url: '/api/calls/',
          params: paramsCompare,
        }),
        this.props.fetchEntitiesRequest({
          id: 'callStats',
          url: '/api/calls/',
          params,
        }),
        this.props.fetchEntitiesRequest({
          id: 'practitionerWorked',
          url: '/api/appointments/practitionerWorked',
          params,
        }),
      ]).then(() => {
        this.setState({
          startDate: moment(values.startDate),
          endDate: moment(values.endDate),
          loader: true,
          compare: true,
        });
      });
    } else {
      Promise.all([
        this.props.fetchEntitiesRequest({
          id: 'callStats',
          url: '/api/calls/',
          params,
        }),
        this.props.fetchEntitiesRequest({
          id: 'appointmentStats',
          url: '/api/appointments/stats',
          params,
        }),
        this.props.fetchEntitiesRequest({
          id: 'businessStats',
          url: '/api/appointments/business',
          params,
        }),
        this.props.fetchEntitiesRequest({
          id: 'practitionerWorked',
          url: '/api/appointments/practitionerWorked',
          params,
        }),
      ]).then(() => {
        this.props.setQueryDates({
          startDate: moment(values.startDate),
          endDate: moment(values.endDate),
        });
        this.setState({
          startDate: moment(values.startDate),
          endDate: moment(values.endDate),
          loader: true,
          compare: false,
        });
      });
    }
  }

  render() {
    const callStats = this.props.callStats ? this.props.callStats.toJS() : {};
    const businessStats = this.props.businessStats
      ? this.props.businessStats.toJS()
      : { productionEarnings: [] };
    const appointmentStats = this.props.appointmentStats
      ? this.props.appointmentStats.toJS()
      : {};

    const practitionerWorked = this.props.practitionerWorked
      ? this.props.practitionerWorked.toJS()
      : [];

    const activePatients = appointmentStats.activePatients;
    let unfilledHours = 0;
    let filledHours = 0;

    for (let i = 0; i < practitionerWorked.length; i += 1) {
      filledHours += practitionerWorked[i].booked;
      unfilledHours += practitionerWorked[i].notFilled;
    }

    unfilledHours = unfilledHours.toFixed(0);

    filledHours = filledHours.toFixed(0);

    const serviceData = businessStats.productionEarnings.map(pro => ({
      title: `${pro.description} - ${pro.type}`,
      data: `${Math.floor(pro.totalAmount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    }));

    const pickupPercent =
      Math.floor((100 * callStats.pickup) / callStats.total) || null;
    const bookingPercent =
      Math.floor((100 * callStats.booked) / callStats.total) || null;

    const data = [
      {
        percentage: null,
        question: true,
        count: callStats.total,
        title: 'All Calls',
        icon: 'phone',
        color: 'primaryInactive',
      },
      {
        percentage: pickupPercent,
        question: true,
        count: callStats.pickup,
        title: 'Pickups',
        icon: 'user',
        color: 'primaryNavyBlue',
      },
      {
        percentage: bookingPercent,
        question: true,
        count: callStats.booked,
        title: 'Bookings',
        icon: 'calendar',
        color: 'primaryDarkBlue',
      },
    ];

    const patientsData1 = [
      {
        count: activePatients,
        title: 'Active Patients',
        date: moment({ year: 2017, month: 2, day: 15 }).fromNow(),
        color: 'primaryColor',
      },
      {
        count: appointmentStats.newPatients,
        title: 'New Patients',
        date: moment({ year: 2017, month: 1, day: 15 }).fromNow(),
        color: 'primaryBlue',
      },
      {
        count: businessStats.hygieneAppts,
        title: 'Patients with Hygiene Appts',
        date: moment({ year: 2016, month: 10, day: 10 }).fromNow(),
        color: 'primaryGreen',
      },
    ];

    const patientsData2 = [
      {
        count: unfilledHours,
        title: 'Unfilled Hours',
        date: moment({ year: 2017, month: 2, day: 15 }).fromNow(),
        color: 'primaryColor',
      },
      {
        count: filledHours,
        title: 'Schedule Hours',
        date: moment({ year: 2017, month: 1, day: 15 }).fromNow(),
        color: 'primaryBlue',
      },
      {
        count: businessStats.brokenAppts,
        title: 'Broken Appts Not Filled',
        date: moment({ year: 2016, month: 10, day: 10 }).fromNow(),
        color: 'primaryGreen',
      },
    ];

    const initialValues = {
      endDate: this.state.endDate._d,
      startDate: this.state.startDate._d,
      compareEndDate: this.state.compareEndDate._d,
      compareStartDate: this.state.compareStartDate._d,
    };

    const UserMenu = props => (
      <Button flat {...props} className={stylesOverview.userMenuButton}>
        <span className={stylesOverview.userRole}>
          <i className="fa fa-calendar" />{' '}
          {this.state.startDate.format('MMMM Do YYYY')} -{' '}
          {this.state.endDate.format('MMMM Do YYYY')}&nbsp;
        </span>
        <Icon icon="caret-down" />
      </Button>
    );

    return (
      <Grid className={styles.business}>
        <Row>
          <Col className={styles.business__header} xs={12}>
            <Card className={stylesOverview.intelligence__header_title}>
              <b>Business</b>
              <div
                className={stylesOverview.floatRight}
                data-test-id="businessDatePicker"
              >
                <DropdownMenu
                  labelComponent={UserMenu}
                  closeOnInsideClick={false}
                >
                  <Form
                    className={stylesOverview.formDrop}
                    form="dates"
                    onSubmit={this.submit}
                    initialValues={initialValues}
                    data-test-id="dates"
                  >
                    <Field
                      required
                      component="DayPicker"
                      disabledDays={date =>
                        moment()
                          .subtract(5, 'years')
                          .isAfter(date)
                      }
                      name="startDate"
                      label="Start Date"
                      data-test-id="startDate"
                    />
                    <Field
                      required
                      component="DayPicker"
                      name="endDate"
                      label="End Date"
                      data-test-id="endDate"
                    />
                    {/* <div className={styles.checkbox}>
                        Compare
                        <Field
                          className={styles.marginZero}
                          name="compare"
                          component="Checkbox"
                        />
                    </div>
                    <Field
                      component="DayPicker"
                      name="compareStartDate"
                      label="Compare Start Date"
                    />
                    <Field
                      component="DayPicker"
                      name="compareEndDate"
                      label="Compare End Date"
                    /> */}
                  </Form>
                </DropdownMenu>
              </div>
            </Card>
          </Col>
          <Col className={styles.business__body} xs={12}>
            <Row>
              <Col xs={12}>
                <BusinessStats
                  data={data}
                  className={styles.business__body_arrows}
                />
              </Col>
              <Col xs={12}>
                <Patients
                  className={styles.business__body_call}
                  data={patientsData1}
                  borderColor={colorMap.darkblue}
                  fontColor={colorMap.darkblue}
                  data-test-id={`${activePatients}_activePatients`}
                />
              </Col>
              <Col xs={12} className={styles.business__body_select}>
                <Col xs={12} sm={12}>
                  <ContainerList
                    className={styles.business__body_list}
                    borderColor={colorMap.darkblue}
                    cardTitle="Procedure by Production"
                    data={serviceData}
                  />
                </Col>
              </Col>
              <Col xs={12}>
                <Patients
                  className={styles.business__body_call}
                  data={patientsData2}
                  borderColor={colorMap.darkblue}
                  fontColor={colorMap.darkblue}
                  data-test-id={`${filledHours - unfilledHours}_unfilledHours`}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Business.propTypes = {
  callStatsCompare: PropTypes.object,
  callStats: PropTypes.object,
  businessStats: PropTypes.object,
  appointmentStats: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  practitionerWorked: PropTypes.object,
  fetchEntitiesRequest: PropTypes.func,
};

function mapStateToProps({ apiRequests, intelligence }) {
  const startDate = intelligence.toJS().startDate;
  const endDate = intelligence.toJS().endDate;
  const callStats = apiRequests.get('callStats')
    ? apiRequests.get('callStats').data
    : null;
  const businessStats = apiRequests.get('businessStats')
    ? apiRequests.get('businessStats').data
    : null;
  const appointmentStats = apiRequests.get('appointmentStats')
    ? apiRequests.get('appointmentStats').data
    : null;
  const callStatsCompare = apiRequests.get('callStatsCompare')
    ? apiRequests.get('callStatsCompare').data
    : null;
  const practitionerWorked = apiRequests.get('practitionerWorked')
    ? apiRequests.get('practitionerWorked').data
    : null;

  return {
    callStats,
    practitionerWorked,
    businessStats,
    endDate,
    startDate,
    appointmentStats,
    callStatsCompare,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      setQueryDates: Actions.setQueryDates,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(Business);
