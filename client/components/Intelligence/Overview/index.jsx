import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import MostLoyal from './MostLoyal';
import TopReference from '../TopReference';
import {
  Card, CardHeader, Col, Grid, Row, PieChart,
  DashboardStats, ContainerList,
  BarChart, BigCommentBubble , ChartStats, FlexGrid,
  Stats
} from '../../library';
import colorMap from '../../library/util/colorMap';
import PractitionersList from './PractitionersList';
import AppointmentsBooked from './AppointmentsBooked';
import AppointmentFilled from './AppointmentFilled';
import VisitorConversions  from './Cards/VisitorConversions';
import NewVsReturning from './Cards/NewVsReturning';
import MaleVsFemale from './Cards/MaleVsFemale';
import AgeRange from './Cards/AgeRange';
import VisitorsByDevice from './Cards/VisitorsByDevice';
import BusiestTimeOfWeek from './Cards/BusiestTimeOfWeek';
import WebsiteTrafficSources from './Cards/WebsiteTrafficSources';
import styles from './styles.scss';

class Overview extends Component {
  render() {
    const hardcodeData = [{
      img: '/images/practitioner_1.png',
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 80,
    },{
      img: '/images/practitioner_1.png',
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 46,
    },{
      img: '/images/practitioner_1.png',
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 21,
    },{
      img: '/images/practitioner_1.png',
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 10,
    }];

    const data = [
      {count: 388, title: "Appointment Booked", icon: "calendar", size: 6, color: 'primaryColor' },
      {count: "116K", title: "Estimated Revenue", icon: "line-chart", size: 6, color: 'primaryBlue' },
      {count: 39, title: "New Patients", icon: "user", size: 6, color: 'primaryGreen' },
      {count: 311, title: "Confirmed Appointments", icon: "check-circle", size: 6, color: 'primaryYellow' },
    ];

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
            <AppointmentFilled borderColor={colorMap.grey}/>
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList borderColor={colorMap.red}
               cardTitle="Top Services by Hours"
               data={[{
                 title: "Invisalign",
                 hours: 35
               },{
                 title: "Teeth Whitening",
                 hours: 28
               },{
                 title: "Regular Checkup",
                 hours: 19.5
               },{
                 title: "Lost Fillings",
                 hours: 11
               },{
                 title: "Emergency Appointments",
                 hours: 5
               }]} />
          </Col>
          <FlexGrid borderColor={colorMap.red} columnCount="4" columnWidth={12}>
            <PractitionersList img="/images/practitioner_1.png"
                               name="Dr. Chelsea"
                               profession="Dentist"
                               appointmentBooked="118"
                               appointmentNotFiltred="42"
                               newPatients="12"
                               percentage="70"
            />
            <PractitionersList img="/images/practitioner_1.png"
                               name="Dr. Mike"
                               profession="Dentist"
                               appointmentBooked="142"
                               appointmentNotFiltred="18"
                               newPatients="14"
                               percentage="85"/>
            <PractitionersList img="/images/practitioner_1.png"
                               name="Dr. Jennifer"
                               profession="CDA"
                               appointmentBooked="77"
                               appointmentNotFiltred="83"
                               newPatients="8"
                               percentage="45"
            />
            <PractitionersList img="/images/practitioner_1.png"
                               name="John"
                               profession="Hygienist"
                               appointmentBooked="40"
                               appointmentNotFiltred="110"
                               newPatients="14"
                               percentage="15"/>
          </FlexGrid>
          <FlexGrid borderColor={colorMap.blue} title="Appoinment Types" >
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
          <FlexGrid borderColor={colorMap.blue} title="New vs Returning Patients" >
            <Stats
              count={102}
              details="new"
              icon="user"
            />
            <Stats
              count={349}
              details="returning"
              icon="users"
            />
          </FlexGrid>

          <FlexGrid borderColor={colorMap.blue} title="Website Appts vs Web Profile Appts" >
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

          <FlexGrid borderColor={colorMap.blue} title="Online Reputation" >
            <Stats
              count={"48.5"}
              details="stars"
              icon="star"
            />
            <ChartStats
              positive={88}
              negative={12}
              percantage={80}
            />
          </FlexGrid>
          <Col styles={styles.padding5} xs={12}>
            <AppointmentsBooked
              borderColor={colorMap.yellow}
              cardTitle="Appointments Booked Last 12 Months"
              labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
              dataSets={[
                {
                  label: 'Appointments Booked',
                  color: 'yellow',
                  data: [125, 150, 143, 200, 180, 220, 300 ],
                }
              ]}
            />
          </Col>
          <Col styles={styles.padding5} xs={12}>
            <MostLoyal borderColor={colorMap.red}
                       cardTitle="Most Loyal" />
          </Col>
          <Col xs={12}>
            <TopReference borderColor={colorMap.red} />
          </Col>

          <Col className={classNames(styles.padding, styles.websiteVisitorConversions)} xs={12} md={6}>
            <VisitorConversions
              conversionrate={3.5}
              visits={11086}
              appointments={388}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <NewVsReturning
              newVisitors={68}
              returningVisitors={32}
              chartData={[{ value: 32, color: "blue" }, { value: 68, color: "green" }]}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <MaleVsFemale
              male={45}
              female={55}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <AgeRange
              chartData={[18, 25, 35, 45, 55 ]}
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
              chartData={[{ value: 25, color: "green" }, { value: 75, color: "grey" }]}
            />
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList borderColor={colorMap.green}
                           cardTitle="Pages with Most Visits"
                           data={[{
                             title: "Invisalign",
                             hours: 243
                           },{
                             title: "Teeth Whitening",
                             hours: 199
                           },{
                             title: "Regular Checkup",
                             hours: 183
                           },{
                             title: "Lost Fillings",
                             hours: 146
                           },{
                             title: "Emergency Appointments",
                             hours: 122
                           }]} />
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList borderColor={colorMap.green}
                           cardTitle="Website Engagement"
                           data={[{
                             title: "Total Visits",
                             hours: 11086
                           },{
                             title: "Avg Visit Duration",
                             hours: "3.38"
                           },{
                             title: "Pages per Visit",
                             hours: "3.8"
                           },{
                             title: "Bounce Rate",
                             hours: "47%"
                           }]} />
          </Col>
          <Col className={styles.padding} xs={12}>
            <WebsiteTrafficSources
              chartData={[
                { label: 'Appointments Booked',
                  color: ['yellow', 'red', 'green', 'blue', 'darkblue', 'grey'],
                  data: [18, 25, 35, 45, 55 , 4],
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
  location: PropTypes.object
}
export default Overview;
