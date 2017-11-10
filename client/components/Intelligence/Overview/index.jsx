import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { bindActionCreators } from 'redux';
import FilterPractitioners from '../../Schedule/Cards/Filters/FilterPractitioners';
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
import { SortByFirstName } from '../../library/util/SortEntities';
import nFormatter from '../nFormatter';


class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      endDate: moment(new Date()),
      startDate: moment(new Date()).subtract(moment(new Date()).get('date') - 1, 'days'),
      active: false,
      loader: false,
      displayPractitioners: [],
    };

    this.reinitializeState = this.reinitializeState.bind(this);
    this.filterFunction = this.filterFunction.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
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
        id: 'practitionerWorked',
        url: '/api/appointments/practitionerWorked',
        params,
        returnData: true,
      }),
      this.props.fetchEntitiesRequest({
        id: 'mostAppointments',
        url: '/api/appointments/mostAppointments',
        params,
      }),
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
        id: 'appointmentsBooked',
        url: '/api/appointments/appointmentsBooked',
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
      this.props.fetchEntitiesRequest({
        id: 'totalRevenueStats',
        url: '/api/patients/revenueStatsTotal',
        params,
      }),
    ])
      .then((data) => {
        const displayPractitioners = data[0].map(p => p.id);
        this.setState({
          loader: true,
          displayPractitioners,
        });
      });
  }

  handleFilterClick(bool, id) {
    const displayPractitioners = this.state.displayPractitioners;
    // console.log(a,b,c)
    if (bool) {
      const index = displayPractitioners.indexOf(id);

      if (index > -1) {
        displayPractitioners.splice(index, 1);
      }
    } else {
      displayPractitioners.push(id);
    }

    this.setState({ displayPractitioners });
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
        id: 'practitionerWorked',
        url: '/api/appointments/practitionerWorked',
        params,
        returnData: true,
      }),
      this.props.fetchEntitiesRequest({
        id: 'mostAppointments',
        url: '/api/appointments/mostAppointments',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'appointmentStats',
        url: '/api/appointments/stats',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'appointmentsBooked',
        url: '/api/appointments/appointmentsBooked',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'patientRevenueStats',
        url: '/api/patients/revenueStats',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'totalRevenueStats',
        url: '/api/patients/revenueStatsTotal',
        params,
      }),
    ]).then((data) => {
      const displayPractitioners = data[0].map(p => p.id);
      const newState = {
        startDate: moment(values.startDate),
        endDate: moment(values.endDate),
        active: false,
        loader: true,
        displayPractitioners,
      };

      this.setState(newState);
    });
  }

  filterFunction() {
    this.setState({
      active: true,
    });
  }

  render() {
    const appointmentStats = (this.props.appointmentStats ?
      this.props.appointmentStats.toObject() : null);

    const practitionerWorked = (this.props.practitionerWorked ?
      this.props.practitionerWorked.toJS() : null);

    const appointmentsBookedStats = (this.props.appointmentsBooked ?
      this.props.appointmentsBooked.toObject() : null);

    const mostAppointments = (this.props.mostAppointments ?
      this.props.mostAppointments.toJS() : null);

    const totalRevenueStats = (this.props.totalRevenueStats ?
      this.props.totalRevenueStats.toObject().totalAmountClinic : 0);

    const patientStats = (this.props.patientStats ? this.props.patientStats.toObject() : null);
    const patientRevenueStats = (this.props.patientRevenueStats ? this.props.patientRevenueStats.toJS() : []);

    let male = (patientStats ? patientStats.male : 0);
    let female = (patientStats ? patientStats.female : 0);
    const ageRange = (patientStats ? patientStats.ageData.toArray() : []);
    const newVisitors = (appointmentStats ? appointmentStats.newPatients : 0);
    const allApp = (appointmentStats ? appointmentStats.activePatients : 0);
    const returning = allApp - newVisitors;
    const newVisitorPercent = Math.floor((newVisitors * 100 / allApp) + 0.5);
    const returningPercent = 100 - newVisitorPercent;

    male = Math.floor((male * 100 / (male + female)) + 0.5);
    female = 100 - male;

    const totalData = {
      appointmentBooked: 0,
      appointmentNotFiltred: 0,
    };

    let serviceData = patientRevenueStats.map((patient) => {
      const age = patient.birthDate ? moment().diff(patient.birthDate, 'years') : 'N/A';
      return {
        name: `${patient.firstName} ${patient.lastName}`,
        age,
        number: `$${patient.totalAmount.toLocaleString()}`,
        firstName: patient.firstName,
      };
    });

    const prac = (practitionerWorked || []).filter(p => {
      return this.state.displayPractitioners.includes(p.id);
    });



    serviceData = serviceData.sort((a, b) => b.hours - a.hours);

    const colors = ['primaryColor', 'primaryBlueGreen', 'primaryYellow', 'primaryGreen'];
    const colorLen = colors.length;
    const colorArray = [];


    const reset = Math.ceil((prac.length - colorLen) / colorLen);

    for (let j = 0; j <= reset; j++) {
      for (let i = 0; i < colorLen; i++) {
        colorArray.push(colors[i]);
      }
    }

    const realData = (practitionerWorked ? (
      prac.sort((pracData, pracData2) => {
        const a = pracData;
        const b = pracData2;
        if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
        if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
        return 0;
      }).map((key, index) => {
        const data = {};
        data.appointmentBooked = key.booked;
        data.appointmentNotFiltred = key.notFilled;
        data.appointmentNotFiltred = (data.appointmentNotFiltred > 0 ? data.appointmentNotFiltred : 0);
        data.percentage = Math.floor(100 * data.appointmentBooked / (data.appointmentNotFiltred + data.appointmentBooked));
        data.name = (/Dentist/g.test(key.type) ? `Dr. ${key.lastName}` : `${key.firstName} ${key.lastName || ''}`);
        data.img = '/images/avatar.png';
        totalData.appointmentBooked += data.appointmentBooked;
        totalData.appointmentNotFiltred += data.appointmentNotFiltred;
        data.newPatients = key.newPatientsTotal;

        return (
          <PractitionersList
            img={data.img}
            name={data.name}
            profession={key.type}
            appointmentBooked={data.appointmentBooked}
            appointmentNotFiltred={data.appointmentNotFiltred}
            newPatients={data.newPatients}
            percentage={data.percentage}
            practitioner={key}
            color={colorArray[index]}
          />);
      })) : <div />);

    const allAppointments = (appointmentsBookedStats ?
      appointmentsBookedStats.appointmentsBooked : 0);

    const confirmedAppointmentsBooked = (appointmentsBookedStats ?
      appointmentsBookedStats.confirmedAppointments : 0);

    const sortedPatients = (mostAppointments ? mostAppointments.map(key => {
      return {
        name: `${key.firstName} ${key.lastName}`,
        age: moment().diff(moment(key.birthDate), 'years'),
        number: key.numAppointments,
        firstName: key.firstName,
        lastName: key.lastName,
      };
    }) : []);

    const data = [
      {
        count: allAppointments,
        title: 'Appointments Booked',
        icon: 'calendar',
        size: 6,
        color: 'primaryColor',
      },
      {
        count: `$${nFormatter(totalRevenueStats, 1)}`,
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
        count: confirmedAppointmentsBooked,
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
      <DialogBox
        actions={actions}
        title="Filter Practitioners"
        type="small"
        active={this.state.active}
        onEscKeyDown={this.reinitializeState}
        onOverlayClick={this.reinitializeState}
      >
        <FilterPractitioners
          filterKey="practitionersFilter"
          practitioners={practitionerWorked}
          selectedFilterItem={this.state.displayPractitioners}
          handleEntityCheck={this.handleFilterClick}
        />
      </DialogBox>
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
                    onSubmit={(values) => {
                      this.submit(values);
                      this.myinput.focus();
                    }}
                    initialValues={initialValues}
                    data-test-id="dates"
                    enableReinitialize={true}
                  >
                    <Field
                      required
                      component="DayPicker"
                      disabledDays={date => moment().subtract(5, 'years').isAfter(date)}
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
        <Loader loaded={this.state.loader} color="#FF715C">
          <Row className={styles.intelligence__body}>
            <Col xs={12} >
              <DashboardStats data={data} data-test-id={`${allAppointments}_appointmentsConfirmed`}/>
            </Col>
            <Col xs={12} sm={6} className={styles.padding}>
              <AppointmentFilled
                appointmentFilled={totalData.appointmentBooked}
                appointmentNotFilled={totalData.appointmentNotFiltred}
                startDate={this.state.startDate._d}
                endDate={this.state.endDate._d}
                borderColor={colorMap.grey}
              />
            </Col>
            <Col xs={12} sm={6} className={styles.padding}>
              <TopReference
                ref={(ref) => this.myinput = ref}
                title="Most Business"
                data={serviceData}
                className={styles.maxHeight}
                borderColor={colorMap.grey}
              />
            </Col>
            <div className={styles.background}>
            <Button
              onClick={this.filterFunction}
              className={styles.filterButton}
            >
              Filter
            </Button>

              <FlexGrid className={styles.white} columnCount="4" columnWidth={12}>
                {realData}
              </FlexGrid>
            </div>
            <Col
              className={styles.padding}
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
                title="Most Appointments"
                data={sortedPatients}
                borderColor={colorMap.grey}
              />
            </Col>
            <Col className={styles.padding} xs={12} md={6}>
              <AgeRange
                chartData={ageRange}
              />
            </Col>
            <Col className={styles.padding} cxs={12} md={6}>
              <MaleVsFemale
                title="Male vs Female Patients for the Last 12 Months"
                male={male || 0}
                female={female || 0}
              />
            </Col>
            <Col className={styles.padding} xs={12} sm={12}>
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
            <Col className={styles.padding} xs={12} sm={12}>
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
  patientRevenueStats: PropTypes.object,
  totalRevenueStats: PropTypes.object,
  patientStats: PropTypes.func,
  fetchEntitiesRequest: PropTypes.func,
  location: PropTypes.object,
  practitionerWorked: PropTypes.object,
  mostAppointments: PropTypes.object,
  appointmentsBooked: PropTypes.object,
};

function mapStateToProps({ apiRequests }) {
  const appointmentStats = (apiRequests.get('appointmentStats') ? apiRequests.get('appointmentStats').data : null);
  const appointmentStatsLastYear = (apiRequests.get('appointmentStatsLastYear') ? apiRequests.get('appointmentStatsLastYear').data : null);
  const dayStats = (apiRequests.get('dayStats') ? apiRequests.get('dayStats').data : null);
  const patientStats = (apiRequests.get('patientStats') ? apiRequests.get('patientStats').data : null);
  const patientRevenueStats = (apiRequests.get('patientRevenueStats') ? apiRequests.get('patientRevenueStats').data : null);
  const totalRevenueStats = (apiRequests.get('totalRevenueStats') ? apiRequests.get('totalRevenueStats').data : null);

  //new stuff
  const appointmentsBooked = (apiRequests.get('appointmentsBooked') ? apiRequests.get('appointmentsBooked').data : null);
  const practitionerWorked = (apiRequests.get('practitionerWorked') ? apiRequests.get('practitionerWorked').data : null);
  const mostAppointments = (apiRequests.get('mostAppointments') ? apiRequests.get('mostAppointments').data : null);

  return {
    appointmentStats,
    appointmentsBooked,
    appointmentStatsLastYear,
    dayStats,
    patientStats,
    patientRevenueStats,
    totalRevenueStats,
    practitionerWorked,
    mostAppointments,
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
