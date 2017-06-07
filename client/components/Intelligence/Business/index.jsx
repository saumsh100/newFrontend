import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { bindActionCreators } from 'redux';import moment from 'moment';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import {
  Card, DialogBox, Col, Grid, Row, Button,
  DashboardStats, ContainerList,
  Form, RemoteSubmitButton, Field, ChartStats, FlexGrid,
  Stats, DropdownMenu, Icon,
} from '../../library';
import colorMap from '../../library/util/colorMap';
import BusinessStats from './Cards/BusinessStats';
import DataStats from './Cards/DataStats';
import Patients from './Cards/Patients';
import styles from './styles.scss';
import stylesOverview from '../Overview/styles.scss';

class Business extends Component {

  constructor(props) {
    super(props);
    this.state = {
      endDate: moment(new Date()),
      startDate: moment(new Date()).subtract(moment(new Date()).get('date') - 1, 'days'),
      active: false,
      loader: false,
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const params = {
      startDate: this.state.startDate._d,
      endDate: this.state.endDate._d,
      accountId: decodedToken.activeAccountId,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'callStats',
        url: '/api/calls/',
        params }),
    ])
      .then(() => {
        this.setState({
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

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'callStats',
        url: '/api/calls/',
        params }),
    ])
      .then(() => {
        this.setState({
          loader: true,
        });
      });
  }

  render() {
    const callStats = (this.props.callStats ? this.props.callStats.toJS() : {});

    console.log(callStats)
    const data = [
      {percentage: 12, question: true, count: callStats.total, title: 'All Calls', icon: 'phone', color: 'primaryInactive' },
      {percentage: Math.floor(100 * callStats.pickup / callStats.total), question: true, count: callStats.pickup, title: 'Pickups', icon: 'user', color: 'primaryNavyBlue' },
      {percentage: Math.floor(100 * callStats.booked / callStats.total), question: true, count: callStats.booked, title: 'Bookings', icon: 'calendar-o', color: 'primaryDarkBlue' },];

    const tabStep = [{label: 'Online Booking', data: {count: '10,104', title: 'Website Visits', icon: 'television', color: 'primaryColor' }},
      {label: 'Calls From Website', data: {count: 102, title: 'Online Booking', icon: 'users', color: 'primaryColor' }}, ];

    const patientsData1 = [
      {count: 5433, title: 'Active Patients', date:  moment({year: 2017, month: 2, day: 15}).fromNow(), color: 'primaryColor' },
      {count: 39, title: 'New Patients', date:  moment({year: 2017, month: 1, day: 15}).fromNow(), color: 'primaryBlue' },
      {count: 1746, title: 'Patients with Hygiene Appts', date:  moment({year: 2016, month: 10, day: 10}).fromNow(), color: 'primaryGreen' },
      {count: '$288', title: 'Average Hourly Production', date:  moment({year: 2015, month: 6, day: 15}).fromNow(), color: 'primaryGreen' },];
    const patientsData2 = [
      {count: 160, title: 'Unflled Hours', date:  moment({year: 2017, month: 2, day: 15}).fromNow(), color: 'primaryColor' },
      {count: 480, title: 'Schedule Hours', date:  moment({year: 2017, month: 1, day: 15}).fromNow(), color: 'primaryBlue' },
      {count: 13, title: 'Broken Appts Not Filled', date:  moment({year: 2016, month: 10, day: 10}).fromNow(), color: 'primaryGreen' },
      {count: '$1300', title: 'Revenue Lost From Broken Appts', date:  moment({year: 2015, month: 6, day: 15}).fromNow(), color: 'primaryGreen' },];

    const hardcodeData1 = [
      {count: 202, icon: 'phone'},
      {count: 141, icon: 'user'},
      {count: 71, icon: 'calendar-o'},];
    const hardcodeData2 = [
      {percentage: 2, subtitle: 'Calls From Website'},
      {percentage: 70, subtitle: 'Pickups'},
      {percentage: 53, subtitle: 'Booking'},];

    const initialValues = {
      endDate: this.state.endDate._d,
      startDate: this.state.startDate._d,
    };

    const UserMenu = (props) => {
      return (
        <Button flat {...props} className={stylesOverview.userMenuButton}>
          <span className={stylesOverview.userRole}><i className="fa fa-calendar" /> {this.state.startDate.format('MMMM Do YYYY')} - {this.state.endDate.format('MMMM Do YYYY')}&nbsp;</span>
          <Icon icon="caret-down" />
        </Button>
      );
    };

    return (
      <Grid className={styles.business}>
        <Row>
          <Col className={styles.business__header} xs={12}>
            <Card className={stylesOverview.intelligence__header_title}>
              <b>Business</b>
              <div className={stylesOverview.floatRight}>
                <DropdownMenu labelComponent={UserMenu} closeOnInsideClick={false}>
                  <Form
                    className={stylesOverview.formDrop}
                    form='dates'
                    onSubmit={this.submit}
                    initialValues={initialValues}
                  >
                    <Field
                      required
                      component="DayPicker"
                      name="startDate"
                      label="Start Date"
                    />
                    <Field
                      required
                      component="DayPicker"
                      name="endDate"
                      label="End Date"
                    />
                  </Form>
                </DropdownMenu>
              </div>
            </Card>
          </Col>
          <Col className={styles.business__body} xs={12}>
            <Row>
              <Col xs={12}>
                <BusinessStats data={data} className={styles.business__body_arrows} />
              </Col>
              <Col xs={12}>
                <DataStats
                  data={tabStep}
                  borderColor={colorMap.darkblue}
                  className={styles.business__body_call}
                  data1={hardcodeData1}
                  data2={hardcodeData2}
                />
              </Col>
              <Col xs={12}>
                <Patients
                  className={styles.business__body_call}
                  data={patientsData1}
                  borderColor={colorMap.darkblue}
                  fontColor={colorMap.darkblue}
                />
              </Col>
              <Col xs={12} className={styles.business__body_select}>
                <Col xs={12} sm={6}>
                  <ContainerList
                    className={styles.business__body_list}
                    borderColor={colorMap.darkblue}
                    cardTitle="Procedure by Hours"
                    data={[{
                      title: 'Invisalign',
                      hours: '33,487',
                    }, {
                      title: 'Teeth Whitening',
                      hours: '3,617',
                    }, {
                      title: 'Regular Checkup',
                      hours: '1,901',
                    }, {
                      title: 'Lost Fillings',
                      hours: '13,717',
                    }, {
                      title: 'Emergency Appointments',
                      hours: '33,487',
                    }]}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <ContainerList
                    className={styles.business__body_list}
                    borderColor={colorMap.darkblue}
                    cardTitle="Procedure by Production"
                    data={[{
                      title: 'Invisalign',
                      hours: '33,487',
                    }, {
                      title: 'Teeth Whitening',
                      hours: '3,617',
                    }, {
                      title: 'Regular Checkup',
                      hours: '1,901',
                    }, {
                      title: 'Lost Fillings',
                      hours: '13,717',
                    }, {
                      title: 'Emergency Appointments',
                      hours: '33,487',
                    }]}
                  />
                </Col>
              </Col>
              <Col xs={12}>
                <Patients
                  className={styles.business__body_call}
                  data={patientsData2}
                  borderColor={colorMap.darkblue}
                  fontColor={colorMap.darkblue}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps({ entities, apiRequests }) {
  const callStats = (apiRequests.get('callStats') ? apiRequests.get('callStats').data : null);
  return {
    accounts: entities.getIn(['accounts', 'models']),
    callStats,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Business);
