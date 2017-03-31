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
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'Website Visitor Conversions'} />
              <div className={styles.websiteVisitorConversions__mainContainer}>
                <div className={styles.websiteVisitorConversions__rowContainer}>
                  <div className={styles.websiteVisitorConversions__conversionCount} >
                    <span className={styles.websiteVisitorConversions__row1}>3.5%</span>
                    <span className={styles.websiteVisitorConversions__row2} >Conversions Rate</span>
                  </div>
                </div>
                <div className={styles.websiteVisitorConversions__containerBottom}>
                  <div className={styles.websiteVisitorConversions__stats} >
                    <span>11086</span>
                    <span>Visits</span>
                  </div>
                  <div className={styles.websiteVisitorConversions__stats} >
                    <span>388</span>
                    <span>Appoinments</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'New vs Returning Visitors'} />
              <div className={styles.byGender}>
                <div className={styles.byGender__stats}>
                  <div className={styles.byGender__stats__percentage} >
                    <span className={styles.byGender__stats__percentage_left} >68%</span>
                    <span className={styles.byGender__stats__percentage_left} >New Visitors</span>
                  </div>
                  <div className={styles.byGender__stats__percentage} >
                    <span className={styles.byGender__stats__percentage_right} >32%</span>
                    <span className={styles.byGender__stats__percentage_right} >Returning Visitors</span>
                  </div>
                </div>
                <div className={styles.pieChartWrapper}>
                  <PieChart
                    type="doughnut"
                  data={[{ value: 32, color: "blue" }, { value: 68, color: "green" }]}
                />
                </div>
              </div>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Male vs Famale" />
              <div className={styles.maleVsFamale}>
                <div className={styles.maleVsFamale__menContainer}>
                  <div className={styles.maleVsFamale__menContainer__item}>
                    <span className={classNames(styles.maleVsFamale__menContainer__item_iconMale ,"fa fa-male")}></span>
                    <span className={styles.maleVsFamale__menContainer__item_man}>45%</span>
                    <span className={styles.maleVsFamale__menContainer__item_smallText} >Male</span>
                  </div>

                  <div className={styles.maleVsFamale__menContainer__item} >
                    <span className={classNames(styles.maleVsFamale__menContainer__item_iconFemale, "fa fa-female")}></span>
                    <span className={styles.maleVsFamale__menContainer__item_famale}>55%</span>
                    <span className={styles.maleVsFamale__menContainer__item_smallText} >Female</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="Age Range" />
              <div className={styles.ageRange}>
                <div className={styles.ageRange__content}>
                  <BarChart
                    type="horizontal"
                    displayTooltips={true}
                    labels={["18-24", "25-34", "35-44", "45-54", "55+"]}
                    dataSets={[
                      { label: 'Appointments Booked',
                        color: ['yellow', 'red', 'green', 'blue'],
                        data: [18, 25, 35, 45, 55 ] ,
                      },
                    ]
                    }
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Visitors by device" />
              <div className={styles.visitors}>
                <div className={styles.visitors__container} >
                  <div className={styles.visitors__item} >
                    <span className={classNames(styles.visitors__item_mobile, "fa fa-mobile-phone")}></span>
                    <span className={styles.visitors__item__text}>5844</span>
                    <span className={styles.visitors__item__smallText}>Mobile</span>
                  </div>
                  <div className={styles.visitors__item} >
                    <span className={classNames(styles.visitors__item_tablet, "fa fa-tablet")}></span>
                    <span className={styles.visitors__item__text}>759</span>
                    <span className={styles.visitors__item__smallText}>Tablet</span>
                  </div>
                  <div className={styles.visitors__item} >
                    <span className={classNames(styles.visitors__item_computer, "fa fa-television")}></span>
                    <span className={styles.visitors__item__text}>4663</span>
                    <span className={styles.visitors__item__smallText}>Website</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'Busiest time of week'} />
              <div className={styles.bussiestTimeOfWeekWrapper}>
                <div className={classNames(styles.pieChartWrapper)}  style={{width: '200px'}} >
                  <PieChart
                    width={171}
                    height={85}
                    data={[{ value: 25, color: "green" }, { value: 75, color: "grey" }]}
                  />
                </div>
                <div className={styles.bussiestTimeOfWeekWrapper__day}>
                  <div className={styles.bussiestTimeOfWeekWrapper__day__dayContent} >
                    <span>Tuesday</span>
                    <span>12pm - 3pm</span>
                  </div>
                </div>
              </div>
            </Card>
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
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Website Traffice Sources" />
              <div className={styles.websiteTrafikSources}>
                <div className={styles.websiteTrafikSources__mainContent}>
                  <BarChart
                    displayTooltips={true}
                    labels={["Direct", "Referrals", "Search", "Social", "Mail", "Display"]}
                    dataSets={[
                      { label: 'Appointments Booked',
                        color: ['yellow', 'red', 'green', 'blue', 'darkblue', 'grey'],
                        data: [18, 25, 35, 45, 55 , 4] ,
                      },
                    ]
                    }
                  />
                </div>
              </div>
            </Card>
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
