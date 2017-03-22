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
    return (
      <Grid className={styles.intelligence}>
        <Row>
          <Col className={styles.intelligence__header} xs={12}>
            <Card className={styles.intelligence__header_title}>
              <b>Overview</b>
            </Card>
            <DashboardStats/>
          </Col>
          <Col xs={12}>
            <Row>
              <Col xs={12} sm={6}>
                <AppointmentFilled borderColor={colorMap.grey}/>
              </Col>
              <Col xs={12} sm={6}>
                <ContainerList borderColor={colorMap.red}
                               cardTitle="Top Services by Hours"
                               data={[{
                                 title: "Invisalign",
                                 hours: 42
                               },{
                                 title: "Invisalign",
                                 hours: 42
                               },{
                                 title: "Invisalign",
                                 hours: 42
                               },{
                                 title: "Invisalign",
                                 hours: 42
                               },{
                                 title: "Invisalign",
                                 hours: 42
                               }]} />
              </Col>
            </Row>
          </Col>
          <FlexGrid borderColor={colorMap.blue} columnCount="4">
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Chelsea"
                               profession="Hygienist"
                               appointmentBooked="77"
                               appointmentNotFiltred="83"
                               newPatients="12"
                               percentage="10"
            />
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Chelsea"
                               profession="Hygienist"
                               appointmentBooked="77"
                               appointmentNotFiltred="83"
                               newPatients="12"
                               percentage="10"/>
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Chelsea"
                               profession="Hygienist"
                               appointmentBooked="77"
                               appointmentNotFiltred="83"
                               newPatients="12"
                               percentage="10"
            />
            <PractitionersList img="images/practitioner_1.png"
                               name="Dr. Chelsea"
                               profession="Hygienist"
                               appointmentBooked="77"
                               appointmentNotFiltred="83"
                               newPatients="12"
                               percentage="10"/>
          </FlexGrid>
          <FlexGrid borderColor={colorMap.blue} title="Appoinment Types" >
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
          </FlexGrid>
          <FlexGrid borderColor={colorMap.blue} title="Appoinment Types" >
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
          </FlexGrid>
          <FlexGrid borderColor={colorMap.blue} title="Appoinment Types" >
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
            <ChartStats
              positive={80}
              negative={20}
              percantage={80}
            />
          </FlexGrid>
          <FlexGrid borderColor={colorMap.blue} title="Appoinment Types" >
            <Stats
              count={106}
              details="via phone"
              icon="telegram"
            />
            <ChartStats
              positive={50}
              negative={50}
              percantage={50}
            />
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
            <Stats
              count={106}
              details="via phone"
              icon="phone"
            />
          </FlexGrid>
        </Row>
        <Row>
        </Row>
        <Col xs={12}>
          <AppointmentsBooked borderColor={colorMap.yellow}
                              cardTitle="Appointments Booked Last 12 Months" />
        </Col>
        <Col xs={12}>
          <MostLoyal borderColor={colorMap.red}
                     cardTitle="Most Loyal" />
        </Col>
        <Col xs={12}>
          <TopReference borderColor={colorMap.red} />
        </Col>
        <Row>
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
              <div className={classNames(styles.rowContainer, styles.spaceAround, styles.height400)}>
                <div className={classNames(styles.columnContainer, styles.spaceAround)}>
                  <div className={classNames(styles.columnContainer, styles.width200, styles.alignFlexEnd)} >
                    <span className={classNames(styles.colorGreen, styles.font64, styles.fontWeight800)} >68%</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.textAlignRight)} >New Visitors</span>
                  </div>

                  <div className={classNames(styles.columnContainer, styles.width200, styles.alignFlexEnd)} >
                    <span className={classNames(styles.colorBlue, styles.font64, styles.fontWeight800)} >32%</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.textAlignRight)} >Returning Visitors</span>
                  </div>
                </div>

                <div className={styles.width200}>
                  <PieChart
                  width={171}
                  height={85}
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
                  <div className={classNames(styles.menContainer__item, styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.menContainer__item_text, styles.colorWoman, styles.font82, styles.fontWeight800, "fa fa-user-o")}></span>
                    <span className={classNames(styles.menContainer__item_text, styles.colorWoman, styles.font82, styles.fontWeight800, styles.textAlignRight, styles.marginTop30)}>55%</span>
                    <span className={classNames(styles.colorBlack, styles.font24)} >Famale</span>
                  </div>

                  <div className={classNames(styles.menContainer__item, styles.columnContainer, styles.justifyCenter)}>
                    <span className={classNames(styles.menContainer__item_text, styles.colorMan, styles.font82, styles.fontWeight800, "fa fa-user-o")}></span>
                    <span className={classNames(styles.menContainer__item_text, styles.colorMan, styles.font82, styles.fontWeight800, styles.textAlignRight, styles.marginTop30)}>45%</span>
                    <span className={classNames(styles.colorBlack, styles.font24)} >Male</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Visitors by device" />
              <div className={classNames(styles.columnContainer, styles.spaceAround, styles.width100p, styles.height400)}>
                <div className={classNames(styles.rowContainer, styles.alignFlexEnd, styles.width100p, styles.spaceAround)} >
                  <div className={classNames(styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.colorMobile, styles.font56, styles.fontWeight800, "fa fa-mobile-phone")}></span>
                    <span className={classNames(styles.colorBlack, styles.font48, styles.fontWeight800, styles.marginTop30)}>5844</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.fontWeight200)}>Mobile</span>
                  </div>
                  <div className={classNames(styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.colorTablet, styles.font64, styles.fontWeight800, "fa fa-tablet")}></span>
                    <span className={classNames(styles.colorBlack, styles.font48, styles.fontWeight800, styles.marginTop30)}>759</span>
                    <span className={classNames(styles.colorBlack, styles.font24, styles.fontWeight200)}>Tablet</span>
                  </div>
                  <div className={classNames(styles.columnContainer, styles.justifyCenter)} >
                    <span className={classNames(styles.colorTablet, styles.font82, styles.fontWeight800, "fa fa-television")}></span>
                    <span className={classNames(styles.colorBlack, styles.font48, styles.fontWeight800, styles.marginTop30)}>4663</span>
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
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <ContainerList borderColor={colorMap.green}
                           cardTitle="Pages with Most Visits"
                           data={[{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           }]} />
          </Col>
          <Col xs={12} sm={6}>
            <ContainerList borderColor={colorMap.green}
                           cardTitle="Website Engagement"
                           data={[{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
                           },{
                             title: "Invisalign",
                             hours: 42
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

export default IntelligenceComponent;
