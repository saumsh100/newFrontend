import React, { PropTypes, Component } from "react";
import { Card, CardHeader, Col, Grid, Row, PieChart, DashboardStats, ContainerList,  BarChart, BigCommentBubble , ChartStats, FlexGrid,
  Stats} from "../library";
import { AtomTextBlock, AtomText, AtomTextBlockWrapper } from "../library/AtomText";
import colorMap from "../library/util/colorMap";
import PractitionersList from "./PractitionersList";
import AppointmentsBooked from "./AppointmentsBooked";
import MostLoyal from "./MostLoyal";
import TopReference from "./TopReference";
import AppointmentFilled from "./AppointmentFilled";
import styles from "./styles.scss";


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
          <FlexGrid borderColor={colorMap.blue}>
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
          <FlexGrid borderColor={colorMap.blue}>
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
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'Vebsite Visitor Conversions'} />
              <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                <AtomTextBlockWrapper styles={{flexDirection: 'row', margin: '60px 0px 60px 0px'}}>
                  <AtomTextBlock styles={{ justifyContent: 'center', width: 220 }} >
                    <AtomText styles={{color: "#2EC4A7", fontSize: 82, fontWeight: 800  }}>3.5%</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 800, textAlign: 'center' }} >Conversions Rate</AtomText>
                  </AtomTextBlock>
                </AtomTextBlockWrapper>
                <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800 }}>11086</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }} >Visits</AtomText>
                  </AtomTextBlock>
                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800 }}>388</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }}>Appoinments</AtomText>
                  </AtomTextBlock>
                </AtomTextBlockWrapper>
              </AtomTextBlockWrapper>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'New vs Returning visitors'} />
              <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around', height: '400px'}}>
                <AtomTextBlockWrapper styles={{flexDirection: 'column', justifyContent: 'space-around' }}>
                  <AtomTextBlock styles={{ alignItems: 'flex-end', width: 220 }} >
                    <AtomText styles={{color: "#2EC4A7", fontSize: 64, fontWeight: 800  }}>68%</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, textAlign: 'right' }}>New Visitors</AtomText>
                  </AtomTextBlock>
                  <AtomTextBlock styles={{ alignItems: 'flex-end', width: 220 }} >
                    <AtomText styles={{color: "#8FBBD6", fontSize: 64, fontWeight: 800  }}>32%</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, textAlign: 'right' }}>Returning Visitors</AtomText>
                  </AtomTextBlock>
                </AtomTextBlockWrapper>

                <div style={{width: '200px'}}>
                  <PieChart
                  width={171}
                  height={85}
                  data={[{ value: 68, color: "blue" }, { value: 32, color: "green" }]}
                />
                </div>
              </AtomTextBlockWrapper>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Male vs Famale" />
              <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#2CC4A7", fontSize: 82, fontWeight: 800 }} icon="user-o"></AtomText>
                    <AtomText styles={{color: "#2CC4A7", fontSize: 82, fontWeight: 800, margin: "30px 0px 0px 0px" }}>55%</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24 }} >Famale</AtomText>
                  </AtomTextBlock>

                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#8FBBD6", fontSize: 82, fontWeight: 800 }} icon="user-o"></AtomText>
                    <AtomText styles={{color: "#8FBBD6", fontSize: 82, fontWeight: 800, margin: "30px 0px 0px 0px" }}>55%</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24 }} >Male</AtomText>
                  </AtomTextBlock>
                </AtomTextBlockWrapper>
              </AtomTextBlockWrapper>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="Age Range" />
              <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                </AtomTextBlockWrapper>
              </AtomTextBlockWrapper>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Visitors by device" />
              <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end'}}>
                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#FF705A", fontSize: 56, fontWeight: 800 }} icon="mobile-phone"></AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800, margin: "30px 0px 0px 0px" }} >5844</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }} >Mobile</AtomText>
                  </AtomTextBlock>
                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#8FBBD6", fontSize: 64, fontWeight: 800 }} icon="tablet"></AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800, margin: "30px 0px 0px 0px" }}>579</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }}>Tablet</AtomText>
                  </AtomTextBlock>
                  <AtomTextBlock styles={{ justifyContent: 'center' }} >
                    <AtomText styles={{color: "#2EC4A7", fontSize: 82, fontWeight: 800 }} icon="television"></AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800, margin: "30px 0px 0px 0px" }}>4663</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }}>Website</AtomText>
                  </AtomTextBlock>
                </AtomTextBlockWrapper>
              </AtomTextBlockWrapper>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title={'Busiest time of week'} />
              <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around', height: '400px'}}>
                <div style={{width: '200px'}} >
                  <PieChart
                    width={171}
                    height={85}
                    data={[{ value: 25, color: "green" }, { value: 75, color: "grey" }]}
                  />
                </div>
                <AtomTextBlockWrapper styles={{flexDirection: 'column', justifyContent: 'space-around' }}>
                  <AtomTextBlock styles={{ alignItems: 'flex-end', width: 220 }} >
                    <AtomText styles={{color: "#2e3845", fontSize: 82, fontWeight: 800, zIndex: 1  }}>Tuesday</AtomText>
                    <AtomText styles={{color: "#000000", fontSize: 24, textAlign: 'right' }}>12pm - 3px</AtomText>
                  </AtomTextBlock>
                </AtomTextBlockWrapper>
              </AtomTextBlockWrapper>
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
              <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                </AtomTextBlockWrapper>
              </AtomTextBlockWrapper>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default IntelligenceComponent;
