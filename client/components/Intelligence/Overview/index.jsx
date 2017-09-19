import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { bindActionCreators } from 'redux';
import { fetchEntities, fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import {
  Card, DialogBox, Col, Grid, Row, Button,
  DashboardStats, ContainerList,
  Form, RemoteSubmitButton, Field, FlexGrid, DropdownMenu, Icon,
} from '../../library';
import colorMap from '../../library/util/colorMap';
import PractitionersList from './Cards/PractitionersList';
import AppointmentsBooked from './Cards/AppointmentsBooked';
import AppointmentFilled from './Cards/AppointmentFilled';
import NewVsReturning from './Cards/NewVsReturning';
import MaleVsFemale from './Cards/MaleVsFemale';
import AgeRange from './Cards/AgeRange';
import TopReference from './Cards/TopReference';
import WebsiteTrafficSources from './Cards/WebsiteTrafficSources';
import styles from './styles.scss';

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      endDate: moment(new Date()),
      startDate: moment(new Date()).subtract(moment(new Date()).get('date') - 1, 'days'),
      active: false,
      loader: false,
    };

    this.reinitializeState = this.reinitializeState.bind(this);
    this.modelOn = this.modelOn.bind(this);
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
        id: 'patientStats',
        url: '/api/patients/stats',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'appointmentStats',
        url: '/api/appointments/stats',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'dayStats',
        url: '/api/appointments/statsDate',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'appointmentStatsLastYear',
        url: '/api/appointments/statslastyear',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'patientRevenueStats',
        url: '/api/patients/revenueStats',
        params,
      }),
    ])
      .then(() => {
        this.setState({
          loader: true,
        });
      });
  }

  reinitializeState() {
    const newState = {
      active: false,
    };

    this.setState(newState);
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
        id: 'appointmentStats',
        url: '/api/appointments/stats',
        params,
      }),
    ]).then(() => {
      const newState = {
        startDate: moment(values.startDate),
        endDate: moment(values.endDate),
        active: false,
        loader: true,
      };

      this.setState(newState);
    });
  }

  modelOn() {
    this.setState({
      active: true,
    });
  }

  render() {
    const appointmentStats = (this.props.appointmentStats ?
      this.props.appointmentStats.toObject() : null);
    const patientStats = (this.props.patientStats ? this.props.patientStats.toObject() : null);
    const patientRevenueStats = (this.props.patientRevenueStats ? this.props.patientRevenueStats.toObject() : null);

    const prac = (appointmentStats ? appointmentStats.practitioner : {});
    const serve = (appointmentStats ? appointmentStats.services : {});
    const patients = (appointmentStats ? appointmentStats.patients : {});
    let male = (patientStats ? patientStats.male : 0);
    let female = (patientStats ? patientStats.female : 0);
    const ageRange = (patientStats ? patientStats.ageData.toArray() : []);
    const newVisitors = (appointmentStats ? appointmentStats.newPatients : 0);
    const allApp = (appointmentStats ? appointmentStats.notConfirmedAppointments : 0);
    const returning = allApp - newVisitors;
    const newVisitorPercent = Math.floor((newVisitors * 100 / allApp) + 0.5);
    const returningPercent = 100 - newVisitorPercent;

    male = Math.floor((male * 100 / (male + female)) + 0.5);
    female = 100 - male;

    const totalData = {
      appointmentBooked: 0,
      appointmentNotFiltred: 0,
    };

    let serviceData = (appointmentStats ? serve.map(key => ({
      title: key.toObject().name,
      hours: Math.round(key.toObject().time * 10 / 600),
    })) : []);

    serviceData = serviceData.sort((a, b) => b.hours - a.hours);

    const realData = (appointmentStats ? (
      prac.toArray().map((key) => {
        const data = {};
        data.appointmentBooked = Math.floor(key.toObject().appointmentTime / 60) || 0;
        data.appointmentNotFiltred = Math.floor(key.toObject().totalTime / 60) - data.appointmentBooked;
        data.appointmentNotFiltred = (data.appointmentNotFiltred > 0 ? data.appointmentNotFiltred : 0);
        data.percentage = Math.floor(100 * data.appointmentBooked / (data.appointmentNotFiltred + data.appointmentBooked));
        data.name = (/Dentist/g.test(key.toObject().type) ? `Dr. ${key.toObject().lastName}` : `${key.toObject().firstName} ${key.toObject().lastName}`);
        data.img = '/images/avatar.png';
        totalData.appointmentBooked += data.appointmentBooked;
        totalData.appointmentNotFiltred += data.appointmentNotFiltred;
        data.newPatients = key.toObject().newPatients;

        return (
          <PractitionersList
            img={data.img}
            name={data.name}
            profession={key.toObject().type}
            appointmentBooked={data.appointmentBooked}
            appointmentNotFiltred={data.appointmentNotFiltred}
            newPatients={data.newPatients}
            percentage={data.percentage}
            practitioner={key.toObject()}
          />);
      })) : <div />);

    const notConfirmedAppointments = (appointmentStats ?
      appointmentStats.notConfirmedAppointments : 0);

    const confirmedAppointments = (appointmentStats ?
      appointmentStats.confirmedAppointments : 0);

    let sortedPatients = (appointmentStats ? patients.toArray().map(key => ({
      img: key.toObject().avatarUrl,
      name: `${key.toObject().firstName} ${key.toObject().lastName}`,
      age: key.toObject().age,
      number: key.toObject().numAppointments,
    })) : []);

    sortedPatients = sortedPatients.sort((a, b) => b.number - a.number);

    sortedPatients = sortedPatients.slice(0, 4);

    const data = [
      {
        count: notConfirmedAppointments,
        title: 'Appointments Booked',
        icon: 'calendar',
        size: 6,
        color: 'primaryColor',
      },
      {
        count: '?',
        title: 'Estimated Revenue',
        icon: 'line-chart',
        size: 6,
        color: 'primaryBlue',
      },
      {
        count: newVisitors,
        title: 'New Patients',
        icon: 'user',
        size: 6,
        color: 'primaryGreen',
      },
      {
        count: confirmedAppointments,
        title: 'Confirmed Appointments',
        icon: 'check-circle',
        size: 6,
        color: 'primaryYellow',
      },
    ];

    const graphData = (this.props.appointmentStatsLastYear ? this.props.appointmentStatsLastYear.toObject() : null);
    const dataPoints = (graphData ? graphData.data.toArray() : []);
    const dataMonths = (graphData ? graphData.months.toArray() : []);
    let dayStats = (this.props.dayStats ? this.props.dayStats.toObject() : {});
    dayStats = (dayStats.days ? dayStats.days.toArray() : new Array(6).fill(0));


    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.submit, component: RemoteSubmitButton, props: { form: 'dates' } },
    ];

    const initialValues = {
      endDate: this.state.endDate._d,
      startDate: this.state.startDate._d,
    };

    const UserMenu = props => (
      <Button flat {...props} className={styles.userMenuButton}>
        <span className={styles.userRole}><i className="fa fa-calendar" /> {this.state.startDate.format('MMMM Do YYYY')} - {this.state.endDate.format('MMMM Do YYYY')}&nbsp;</span>
        <Icon icon="caret-down" />
      </Button>
      );

    return (
      <Grid className={styles.intelligence}>
        <Row>
          <Col className={styles.intelligence__header} xs={12}>
            <Card className={styles.intelligence__header_title}>
              <b>Overview</b>
              <div
                className={styles.floatRight}
                data-test-id="overViewDatePicker"
              >
                <DropdownMenu
                  labelComponent={UserMenu}
                  closeOnInsideClick={false}
                >
                  <Form
                    className={styles.formDrop}
                    form="dates"
                    onSubmit={this.submit}
                    initialValues={initialValues}
                    data-test-id="dates"
                  >
                    <Field
                      required
                      component="DayPicker"
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
                  </Form>
                </DropdownMenu>
              </div>
            </Card>
          </Col>
        </Row>
        <DialogBox
          actions={actions}
          title="New Patient"
          type="small"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <Form
            form="dates"
            onSubmit={this.submit}
            initialValues={initialValues}
            ignoreSaveButton
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
        </DialogBox>
        <Loader loaded={this.state.loader} color="#FF715C">
          <Row className={styles.intelligence__body}>
            <Col xs={12}>
              <DashboardStats data={data} data-test-id={`${notConfirmedAppointments}_appointmentsConfirmed`}/>
            </Col>
            <Col  xs={12} sm={6}>
              <AppointmentFilled
                appointmentFilled={totalData.appointmentBooked}
                appointmentNotFilled={totalData.appointmentNotFiltred}
                startDate={this.state.startDate._d}
                endDate={this.state.endDate._d}
                borderColor={colorMap.grey}
              />
            </Col>
            <Col   xs={12} sm={6}>
              <ContainerList
                cardTitle="Top Services by Hours"
                data={serviceData}
              />
            </Col>
            <FlexGrid className={styles.padding} borderColor={colorMap.grey} columnCount="4" columnWidth={12}>
              {realData}
            </FlexGrid>
            <Col
              className={classNames(styles.padding, styles.websiteVisitorConversions)}
              xs={12}
              md={6}
            >
              <NewVsReturning
                newVisitors={newVisitorPercent || 0}
                returningVisitors={returningPercent || 0}
                chartData={[{ value: newVisitorPercent, color: 'green' }, { value: returning, color: 'blue' }]}
              />
            </Col>
            <Col className={styles.padding} xs={12} md={6}>
              <TopReference
                data={sortedPatients}
                borderColor={colorMap.grey}
              />
            </Col>
            <Col className={styles.paddingLine} xs={12} md={6}>
              <AgeRange
                chartData={ageRange}
              />
            </Col>
            <Col className={styles.paddingLine} cxs={12} md={6}>
              <MaleVsFemale
                title="Male vs Female Patients for the Last 12 Months"
                male={male || 0}
                female={female || 0}
              />
            </Col>
            <Col className={styles.padding} xs={12} sm={6}>
              <AppointmentsBooked
                borderColor={colorMap.grey}
                cardTitle="Appointments Booked Last 12 Months"
                labels={dataMonths}
                dataSets={[
                  {
                    label: 'Appointments Booked',
                    color: 'yellow',
                    data: dataPoints,
                  },
                ]}
              />
            </Col>
            <Col className={styles.padding} xs={12} sm={6}>
              <WebsiteTrafficSources
                title="Appointments By Day for the Last 12 Months"
                labels={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
                chartData={[
                  { label: 'Appointments Booked',
                    color: ['lightgrey', 'yellow', 'red', 'green', 'blue', 'darkblue', 'grey'],
                    data: dayStats,
                  },
                ]}
              />
            </Col>
          </Row>
        </Loader>
      </Grid>
    );
  }
}
Overview.propTypes = {
  appointmentStats: PropTypes.object,
  appointmentStatsLastYear: PropTypes.object,
  dayStats: PropTypes.object,
  appointmentStats: PropTypes.object,
  patientStats: PropTypes.func,
  fetchEntitiesRequest: PropTypes.func,
  location: PropTypes.object,
};

function mapStateToProps({ apiRequests }) {
  const appointmentStats = (apiRequests.get('appointmentStats') ? apiRequests.get('appointmentStats').data : null);
  const appointmentStatsLastYear = (apiRequests.get('appointmentStatsLastYear') ? apiRequests.get('appointmentStatsLastYear').data : null);
  const dayStats = (apiRequests.get('dayStats') ? apiRequests.get('dayStats').data : null);
  const patientStats = (apiRequests.get('patientStats') ? apiRequests.get('patientStats').data : null);
  const patientRevenueStats = (apiRequests.get('patientRevenueStats') ? apiRequests.get('patientRevenueStats').data : null);

  return {
    appointmentStats,
    appointmentStatsLastYear,
    dayStats,
    patientStats,
    patientRevenueStats,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Overview);
