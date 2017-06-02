import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { bindActionCreators } from 'redux';
import { fetchEntities, fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import {
  Card, CardHeader, Col, Grid, Row, PieChart,
  DashboardStats, ContainerList,
  BarChart, BigCommentBubble , ChartStats, FlexGrid,
  Stats
} from '../../library';
import colorMap from '../../library/util/colorMap';
import PractitionersList from './Cards/PractitionersList';
import AppointmentsBooked from './Cards/AppointmentsBooked';
import AppointmentFilled from './Cards/AppointmentFilled';
import VisitorConversions from './Cards/VisitorConversions';
import NewVsReturning from './Cards/NewVsReturning';
import MaleVsFemale from './Cards/MaleVsFemale';
import AgeRange from './Cards/AgeRange';
import TopReference from './Cards/TopReference';
import MostLoyal from './Cards/MostLoyal';
import VisitorsByDevice from './Cards/VisitorsByDevice';
import BusiestTimeOfWeek from './Cards/BusiestTimeOfWeek';
import WebsiteTrafficSources from './Cards/WebsiteTrafficSources';
import styles from './styles.scss';
import stats from '../../../thunks/stats';


class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: moment(new Date()),
      startDate: moment(new Date()).subtract(30, 'days'),
    };
  }

  componentDidMount() {
    const params = {
      startDate: this.state.startDate._d,
      endDate: this.state.endDate._d,
    };

    this.props.fetchEntities({
      key: 'accounts',
    });
    this.props.fetchEntitiesRequest({id: 'appointmentStats', url: '/api/appointments/stats', params})
  }

  render() {
    const mostLoyalData = [{
      img: '/images/practitioner_1.png',
      name: 'Syndee Hart',
      age: '34',
      phone: '123 456 7890',
      email: 'lwater12@gmail.com',
      loyalNumber: 98,
      appointmentNumber: 17,
    }, {
      img: '/images/practitioner_1.png',
      name: 'Emily Paris',
      age: '7',
      phone: '123 456 7890',
      email: 'emilee1@gmail.com',
      loyalNumber: 83,
      appointmentNumber: 26,
    }, {
      img: '/images/practitioner_1.png',
      name: 'Regan Barlet',
      age: '67',
      phone: '123 456 7890',
      email: 'barlet@gmail.com',
      loyalNumber: 78,
      appointmentNumber: 54,
    }, {
      img: '/images/practitioner_1.png',
      name: 'Syndee Hart',
      age: '34',
      phone: '123 456 7890',
      email: 'lwater12@gmail.com',
      loyalNumber: 98,
      appointmentNumber: 17,
    }, {
      img: '/images/practitioner_1.png',
      name: 'Emily Paris',
      age: '7',
      phone: '123 456 7890',
      email: 'emilee1@gmail.com',
      loyalNumber: 83,
      appointmentNumber: 26,
    }, {
      img: '/images/practitioner_1.png',
      name: 'Regan Barlet',
      age: '67',
      phone: '123 456 7890',
      email: 'barlet@gmail.com',
      loyalNumber: 78,
      appointmentNumber: 54,
    }];

    const appointmentStats = (this.props.appointmentStats ? this.props.appointmentStats.toObject(): null);

    const prac = (appointmentStats ? appointmentStats.practitioner : {});
    const serve = (appointmentStats ? appointmentStats.services : {});
    const patients = (appointmentStats ? appointmentStats.patients: {});
    let male = (appointmentStats ? appointmentStats.male : 0);
    let female = (appointmentStats ? appointmentStats.female : 0);
    let ageRange = (appointmentStats ? appointmentStats.ageData.toArray() : []);
    const newVisitors = (appointmentStats ? appointmentStats.newPatients : 0);
    const allApp = (appointmentStats ? appointmentStats.notConfirmedAppointments : 0);
    const returning = allApp - newVisitors;
    const newVisitorPercent = Math.floor(newVisitors * 100 / allApp + 0.5);
    const returningPercent = 100 - newVisitorPercent;

    male = Math.floor(male * 100 / (male + female) + 0.5);
    female = 100-male;

    const totalData = {
      appointmentBooked: 0,
      appointmentNotFiltred: 0,
    };

    console.log(prac, ageRange)

    const serviceData = (appointmentStats ? serve.map((key) => {
      return {
        title: key.toObject().name,
        hours: Math.round(key.toObject().time * 10 / 600),
      };
    }) : []);


    let realData = (appointmentStats ? (
      prac.toArray().map((key) => {
        const data = {};
        data.appointmentBooked = Math.floor(key.toObject().appointmentTime / 60);
        data.appointmentNotFiltred = Math.floor(key.toObject().totalTime / 60) - data.appointmentBooked;
        data.percentage = Math.floor(100 * data.appointmentBooked / data.appointmentNotFiltred);
        data.name = `Dr. ${key.toObject().lastName}`;
        data.img = '/images/avatar.png';
        totalData.appointmentBooked += data.appointmentBooked;
        totalData.appointmentNotFiltred += data.appointmentNotFiltred;
        data.newPatients = key.toObject().newPatients;

        return (
          <PractitionersList
            img={data.img}
            name={data.name}
            profession="Dentist"
            appointmentBooked={data.appointmentBooked}
            appointmentNotFiltred={data.appointmentNotFiltred}
            newPatients={data.newPatients}
            percentage={data.percentage}
          />);
      })) : <div></div>);

    const notConfirmedAppointments = (appointmentStats ? appointmentStats.notConfirmedAppointments : 0);
    const confirmedAppointments = (appointmentStats ? appointmentStats.confirmedAppointments : 0);

    let sortedPatients = (appointmentStats ? patients.toArray().map((key) => {
      return {
        img: key.toObject().avatarUrl,
        name: `${key.toObject().firstName} ${key.toObject().lastName}`,
        age: key.toObject().age,
        number: key.toObject().numAppointments,
      }
    }) : []);

    sortedPatients = sortedPatients.sort((a,b) => {
      return b.number - a.number;
    });

    sortedPatients = sortedPatients.slice(0,4);

    const data = [
      { count: notConfirmedAppointments, title: 'Appointment Booked', icon: 'calendar', size: 6, color: 'primaryColor' },
      { count: 'N/A', title: 'Estimated Revenue', icon: 'line-chart', size: 6, color: 'primaryBlue' },
      { count: newVisitors, title: 'New Patients', icon: 'user', size: 6, color: 'primaryGreen' },
      { count: confirmedAppointments, title: 'Confirmed Appointments', icon: 'check-circle', size: 6, color: 'primaryYellow' },
    ];


    // const referenceData = []
    //   [{
    //   img: sortedPatients[0].avatarUrl,
    //   name: `${sortedPatients[0].firstName} ${sortedPatients[0].lastName}`,
    //   age: '30',
    //   number: {sortedPatients[0].numAppointments},
    // },{
    //   img: sortedPatients[1].avatarUrl,
    //   name: `${sortedPatients[1].firstName} ${sortedPatients[0].lastName}`,
    //   age: '30',
    //   number: {sortedPatients[1].numAppointments},
    // },{
    //   img: sortedPatients[2].avatarUrl,
    //   name: `${sortedPatients[2].firstName} ${sortedPatients[0].lastName}`,
    //   age: '30',
    //   number: {sortedPatients[2].numAppointments},
    // },{
    //   img: sortedPatients[3].avatarUrl,
    //   name: `${sortedPatients[3].firstName} ${sortedPatients[0].lastName}`,
    //   age: '30',
    //   number: {sortedPatients[4].numAppointments},
    // }];

    return (
      <Grid className={styles.intelligence}>
        <Row>
          <Col className={styles.intelligence__header} xs={12}>
            <Card className={styles.intelligence__header_title}>
              <b>Overview</b>
            </Card>
          </Col>
        </Row>
        <Row className={styles.intelligence__body}>
          <Col xs={12}>
            <DashboardStats data={data} />
          </Col>
          <Col xs={12} sm={6}>
            <AppointmentFilled
              appointmentFilled={totalData.appointmentBooked}
              appointmentNotFilled={totalData.appointmentNotFiltred}
              borderColor={colorMap.grey}
            />
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList
              cardTitle="Top Services by Hours"
              data={serviceData}
            />
          </Col>
          <FlexGrid borderColor={colorMap.grey} columnCount="4" columnWidth={12}>
            {realData}
          </FlexGrid>
          <FlexGrid borderColor={colorMap.grey} title="Appointment Types" >
            <Stats
              count={107}
              details="via phone"
              icon="phone"
            />
            <Stats
              count={281}
              details="via Online Schedule"
              icon="calendar-o"
            />
          </FlexGrid>
          <FlexGrid borderColor={colorMap.grey} title="New vs Returning Patients" >
            <Stats
              count={newVisitors}
              details="new"
              icon="user"
            />
            <Stats
              count={returning}
              details="returning"
              icon="users"
            />
          </FlexGrid>

          <FlexGrid borderColor={colorMap.grey} title="Website Appts vs Web Profile Appts" >
            <Stats
              count={204}
              details="via Website"
              icon="television  "
            />
            <Stats
              count={184}
              details="via Web Profiles"
              icon="map-marker"
            />
          </FlexGrid>

          <FlexGrid borderColor={colorMap.grey} title="Online Reputation" >
            <Stats
              count={48.5}
              details="stars"
              icon="star"
            />
            <ChartStats
              positive={88}
              negative={12}
              percantage={80}
            />
          </FlexGrid>
          <Col xs={12}>
            <AppointmentsBooked
              borderColor={colorMap.grey}
              cardTitle="Appointments Booked Last 12 Months"
              labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
              dataSets={[
                {
                  label: 'Appointments Booked',
                  color: 'yellow',
                  data: [125, 150, 143, 200, 180, 220, 300],
                },
              ]}
            />
          </Col>
          <Col xs={12}>
            <MostLoyal
              borderColor={colorMap.grey}
              cardTitle="Most Loyal"
              data={mostLoyalData}
            />
          </Col>
          <Col xs={12}>
            <TopReference
              data={sortedPatients}
              borderColor={colorMap.grey}
            />
          </Col>
          <Col
            className={classNames(styles.padding, styles.websiteVisitorConversions)} xs={12} md={6}
          >
            <VisitorConversions
              conversionrate={3.5}
              visits={11086}
              appointments={388}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <NewVsReturning
              newVisitors={newVisitorPercent}
              returningVisitors={returningPercent}
              chartData={[{ value: newVisitorPercent, color: 'green' }, { value: returning, color: 'blue' }]}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <MaleVsFemale
              male={male}
              female={female}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <AgeRange
              chartData={ageRange}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <VisitorsByDevice
              mobile={5844}
              tablet={759}
              website={4663}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <BusiestTimeOfWeek
              time={'12pm - 3pm'}
              day={'Tuesday'}
              chartData={[{ value: 25, color: 'green' }, { value: 75, color: 'grey' }]}
            />
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList
              borderColor={colorMap.grey}
              cardTitle="Pages with Most Visits"
              data={[{
                title: 'Invisalign',
                hours: 243,
              }, {
                title: 'Teeth Whitening',
                hours: 199,
              }, {
                title: 'Regular Checkup',
                hours: 183,
              }, {
                title: 'Lost Fillings',
                hours: 146,
              }, {
                title: 'Emergency Appointments',
                hours: 122,
              }]}
            />
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList
              borderColor={colorMap.grey}
              cardTitle="Website Engagement"
              data={[{
                title: 'Total Visits',
                hours: 11086,
              }, {
                title: 'Avg Visit Duration',
                hours: '3.38',
              }, {
                title: 'Pages per Visit',
                hours: '3.8',
              }, {
                title: 'Bounce Rate',
                hours: '47%',
              }]}
            />
          </Col>
          <Col className={styles.padding} xs={12}>
            <WebsiteTrafficSources
              chartData={[
                { label: 'Appointments Booked',
                  color: ['yellow', 'red', 'green', 'blue', 'darkblue', 'grey'],
                  data: [18, 25, 35, 45, 100, 4],
                },
              ]}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
Overview.propTypes = {
  fetchEntities: PropTypes.func,
  location: PropTypes.object
}

function mapStateToProps({ entities, apiRequests }) {
  let appointmentStats = (apiRequests.get('appointmentStats') ? apiRequests.get('appointmentStats').data : null);

  return {
    accounts: entities.getIn(['accounts', 'models']),
    appointmentStats,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    stats,
    fetchEntities,
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Overview);
