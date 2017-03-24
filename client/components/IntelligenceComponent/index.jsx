import React, { PropTypes, Component } from "react";
import { Card, CardHeader, Col, Grid, Row, PieChart, DashboardStats, ContainerList,  BarChart, BigCommentBubble , ChartStats, FlexGrid,
  Stats} from "../library";
import colorMap from "../library/util/colorMap";
import PractitionersList from "./PractitionersList";
import AppointmentsBooked from "./AppointmentsBooked";
import MostLoyal from "./MostLoyal";
import TopReference from "./TopReference";
import AppointmentFilled from "./AppointmentFilled";
import styles from "./styles.scss";
import classNames from 'classnames';

class IntelligenceComponent extends Component {
  render() {
    const hardcodeData = [{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 80,
    },{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 46,
    },{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 21,
    },{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 10,
    }];

    const data = [
      {count: 388, title: "Appointment Booked", icon: "calendar", size: 10, color: 'primaryColor' },
      {count: "116k", title: "Estimated Revenue", icon: "user", size: 10, color: 'primaryBlue' },
      {count: 39, title: "New Patients", icon: "bullhorn", size: 10, color: 'primaryGreen' },
      {count: 311, title: "Confirmed Appointments", icon: "star", size: 10, color: 'primaryYellow' },
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
          <FlexGrid borderColor={colorMap.red} columnCount="4">
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Chelsea"
                               profession="Dentist"
                               appointmentBooked="118"
                               appointmentNotFiltred="42"
                               newPatients="12"
                               percentage="70"
            />
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Mike"
                               profession="Dentist"
                               appointmentBooked="142"
                               appointmentNotFiltred="18"
                               newPatients="14"
                               percentage="85"/>
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Jennifer"
                               profession="CDA"
                               appointmentBooked="77"
                               appointmentNotFiltred="83"
                               newPatients="8"
                               percentage="45"
            />
            <PractitionersList img="images/practitioner_1.png"
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
              icon="phone"
            />
          </FlexGrid>
          <FlexGrid borderColor={colorMap.blue} title="New vs Returning Patients" >
            <Stats
              count={39}
              details="new"
              icon="phone"
            />
            <Stats
              count={349}
              details="returning"
              icon="phone"
            />
          </FlexGrid>

          <FlexGrid borderColor={colorMap.blue} title="Website Appts vs Web Profile Appts" >
            <Stats
              count={204}
              details="via Website"
              icon="phone"
            />
            <Stats
              count={184}
              details="via Web Profiles"
              icon="phone"
            />
          </FlexGrid>

          <FlexGrid borderColor={colorMap.blue} title="Online Reputation" >
            <Stats
              count={"48.5"}
              details="stars"
              icon="phone"
            />
            <ChartStats
              positive={88}
              negative={12}
              percantage={80}
            />
          </FlexGrid>
          <Col xs={12}>
            <AppointmentsBooked borderColor={colorMap.yellow}
                                cardTitle="Appointments Booked Last 12 Months" />
          </Col>
          <Col styles={styles.padding5} xs={12}>
            <MostLoyal borderColor={colorMap.red}
                       cardTitle="Most Loyal" />
          </Col>
          <Col xs={12}>
            <TopReference borderColor={colorMap.red} />
          </Col>

          <Col className={styles.websiteVisitorConversions} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'Vebsite Visitor Conversions'} />
              <div className={styles.websiteVisitorConversions__mainContainer}>
                <div className={styles.websiteVisitorConversions__rowContainer}>
                  <div className={classNames(styles.columnContainer, styles.alignItemsCenter)} >
                    <span className={styles.websiteVisitorConversions__row1}>3.5%</span>
                    <span className={styles.websiteVisitorConversions__row2} >Conversions Rate</span>
                  </div>
                </div>
                <div className={classNames(styles.websiteVisitorConversions__containerBottom, styles.spaceAround)}>
                  <div className={classNames(styles.columnContainer, styles.alignItemsCenter)} >
                    <span className={classNames(styles.colorBlack, styles.font48, styles.fontWeight800)} >11086</span>
                    <span className={classNames(styles.colorBlack, styles.font24)} >Visits</span>
                  </div>
                  <div className={classNames(styles.columnContainer, styles.width200, styles.justifyCenter)} >
                    <span className={classNames(styles.colorBlack, styles.font48, styles.fontWeight800)} >388</span>
                    <span className={classNames(styles.colorBlack, styles.font24)} >Appoinments</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'New vs Returning visitors'} />
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
                  data={[{ value: 68, color: "blue" }, { value: 32, color: "green" }]}
                />
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="Age Range" />
              <div className={classNames(styles.columnContainer, styles.justifyCenter, styles.height400)}>
                <div className={classNames(styles.rowContainer, styles.width100p)}>
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
              <CardHeader className={styles.cardHeader} title="Male vs Famale" />
              <div className={classNames(styles.columnContainer, styles.justifyCenter, styles.height400)}>
                <div className={classNames(styles.menContainer, styles.rowContainer, styles.spaceAround, styles.width100p)}>
                  <div className={classNames(styles.menContainer__item, styles.columnContainer, styles.justifyCenter)}>
                    <span className={classNames(styles.menContainer__item_text, styles.colorMan, styles.font82, styles.fontWeight800, "fa fa-user-o")}></span>
                    <span className={classNames(styles.menContainer__item_text, styles.colorMan, styles.font82, styles.fontWeight800, styles.textAlignRight, styles.marginTop30)}>45%</span>
                    <span className={classNames(styles.colorBlack, styles.font24)} >Male</span>
                  </div>

                  <div className={classNames(styles.menContainer__item, styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.menContainer__item_text, styles.colorWoman, styles.font82, styles.fontWeight800, "fa fa-user-o")}></span>
                    <span className={classNames(styles.menContainer__item_text, styles.colorMan, styles.font82, styles.fontWeight800, styles.textAlignRight, styles.marginTop30)}>55%</span>
                    <span className={classNames(styles.colorBlack, styles.font24)} >Famale</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Visitors by device" />
              <div className={classNames(styles.visitors, styles.columnContainer, styles.spaceAround, styles.width100p, styles.height400)}>
                <div className={classNames(styles.visitors__container, styles.rowContainer, styles.alignFlexEnd, styles.width100p, styles.spaceAround)} >
                  <div className={classNames(styles.visitors__item, styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.colorMobile, styles.font56, styles.fontWeight800, "fa fa-mobile-phone")}></span>
                    <span className={classNames(styles.visitors__text, styles.colorBlack, styles.font48, styles.fontWeight800, styles.marginTop30)}>5844</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.fontWeight200)}>Mobile</span>
                  </div>
                  <div className={classNames(styles.visitors__item, styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.colorTablet, styles.font64, styles.fontWeight800, "fa fa-tablet")}></span>
                    <span className={classNames(styles.visitors__text, styles.colorBlack, styles.font48, styles.fontWeight800, styles.marginTop30)}>759</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.fontWeight200)}>Tablet</span>
                  </div>
                  <div className={classNames(styles.visitors__item, styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.colorTablet, styles.font82, styles.fontWeight800, "fa fa-television")}></span>
                    <span className={classNames(styles.visitors__text, styles.colorBlack, styles.font48, styles.fontWeight800, styles.marginTop30)}>4663</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.fontWeight200)}>Website</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'Busiest time of week'} />
              <div className={classNames(styles.rowContainer, styles.height400, styles.spaceAround, styles.bussiestTimeOfWeekWrapper)}>
                <div className={classNames(styles.pieChartWrapper)}  style={{width: '200px'}} >
                  <PieChart
                    width={171}
                    height={85}
                    data={[{ value: 25, color: "green" }, { value: 75, color: "grey" }]}
                  />
                </div>
                <div className={classNames(styles.columnContainer, styles.spaceAround)}>
                  <div className={classNames(styles.columnContainer, styles.alignFlexEnd, styles.width200)} >
                    <span className={classNames(styles.colorGreen, styles.font54, styles.fontWeight800)}>Tuesday</span>
                    <span className={classNames(styles.colorBlack, styles.font20, styles.textAlignRight)}>12pm - 3pm</span>
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
              <div className={classNames(styles.columnContainer, styles.justifyCenter)}>
                <div className={classNames(styles.rowContainer, styles.width100p)}>
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
IntelligenceComponent.propTypes = {
  location: PropTypes.object
}
export default IntelligenceComponent;
