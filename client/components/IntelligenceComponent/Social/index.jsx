import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row, DashboardStats, CardHeader, BarChart, PieChart, ContainerList, LineChart, Icon } from "../../library";
import BackgroundIcon from "../../library/BackgroundIcon";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import styles from "./styles.scss";


console.log("BackgroundIcon")
console.log(BackgroundIcon)

class Social extends Component {
  render() {
    const data = [
      {count: 388, title: "Facebook likes", icon: "facebook", size: 6, color: 'darkblue' },
      {count: "11k", title: "Twitter followers", icon: "twitter", size: 6, color: 'primaryBlue' },
      {count: 143, title: "Google +", icon: "bullhorn", size: 6, color: 'primaryRed' },
      {count: 671, title: "Instagram followers", icon: "star", size: 6, color: 'primaryYellow' },
    ];
    return (
      <Grid className={styles.social}>
        <Row>
          <Col className={styles.social__header} xs={12}>
            <Card className={styles.social__header_title}>
              <b>Social</b>
            </Card>
          </Col>
        </Row>

        <Row className={styles.social__body}>
          <Col xs={12} md={12}>
            <DashboardStats data={data} />
          </Col>

          <Col className={styles.padding} xs={12} md={12}>
            <Card borderColor={colorMap.darkblue} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="Facebook activity overview" />
              <div className={styles.facebookActivity} >
                <div className={styles.facebookActivity__container} >
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="eye" backgroundClassName="backgroundColorGrey" />
                    <span className={styles.iconsContainer__first}>2,493,840</span>
                    <span className={styles.iconsContainer__last}>Impressions</span>
                  </div>
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="heart" backgroundClassName="backgroundColorDarkBlue" />
                    <span className={styles.iconsContainer__first}>2,493,840</span>
                    <span className={styles.iconsContainer__last}>Engagements</span>
                  </div>
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="location-arrow" backgroundClassName="backgroundColorDarkGrey" />
                    <span className={styles.iconsContainer__first}>2,493,840</span>
                    <span className={styles.iconsContainer__last}>Clicks</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={6}>
            <Card borderColor={colorMap.darkblue}>
              <CardHeader className={styles.cardHeader} title={'By Gender'} />
              <div className={styles.byGender}>
                <div className={styles.byGender__stats}>
                  <div className={styles.byGender__stats__percentage} >
                    <div className={styles.byGender__stats__percentage_left}>
                      <Icon icon="user-o" />
                      <span className={styles.byGender__stats__percentage__count}>68%</span>
                    </div>
                    <span className={styles.byGender__gender}>Male</span>
                  </div>
                  <div className={styles.byGender__stats__percentage} >
                    <div className={styles.byGender__stats__percentage_right}>
                      <Icon icon="user-o" />
                      <span>32%</span>
                    </div>
                    <span className={styles.byGender__gender}>Famale</span>
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

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={6}>
            <Card borderColor={colorMap.darkblue} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="By Age" />
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

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={12}>
            <Card borderColor={colorMap.darkblue} className={styles.fans}>
              <span className={styles.fans__between}>Woman</span> between age of
              <span className={styles.fans__between}>35-44</span>
              appear to be the leader force among your fans
            </Card>
          </Col>

          <Col className={styles.margin} xs={12} sm={6}>
            <Card className={styles.booked} borderColor={colorMap.darkblue}>
              <div className={styles.booked__header}>
                <CardHeader title={"Facebook audience"} />
              </div>
            <div className={styles.booked__body}>
              <LineChart
                displayTooltips={true}
                labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
                dataSets={[
                  {
                    label: 'Appointments Booked',
                    color: 'yellow',
                    data: [125, 150, 143, 200, 180, 220, 300 ],
                  }
                ]}
              />
            </div>
            </Card>
          </Col>

          <Col className={styles.margin} xs={12} sm={6}>
            <ContainerList borderColor={colorMap.darkblue}
               cardTitle="Top Cities"
               data={[{
                 title: "Vancouver, BC, Canada",
                 hours: 160
               },{
                 title: "Calgary, AB, Canada",
                 hours: 153
               },{
                 title: "Toronto, ON, Canada",
                 hours: 111
               },{
                 title: "Winnipeg, MB, Canada",
                 hours: 97
               },{
                 title: "Surrey, BC, Canada",
                 hours: 62
               }]} 
            />
          </Col>

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={12}>
            <Card borderColor={colorMap.primaryBlue} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="Twitter activity overview" />
              <div className={styles.facebookActivity} >
                <div className={styles.facebookActivity__container} >
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="eye" backgroundClassName="backgroundColorGrey" />
                    <span className={styles.iconsContainer__first}>2,493,840</span>
                    <span className={styles.iconsContainer__last}>Impressions</span>
                  </div>
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="heart" backgroundClassName="backgroundPowderBlue" />
                    <span className={styles.iconsContainer__first}>2,493,840</span>
                    <span className={styles.iconsContainer__last}>Engagements</span>
                  </div>
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="location-arrow" backgroundClassName="backgroundColorDarkGrey" />
                    <span className={styles.iconsContainer__first}>2,493,840</span>
                    <span className={styles.iconsContainer__last}>Clicks</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={6}>
            <Card borderColor={colorMap.primaryBlue}>
              <CardHeader className={styles.cardHeader} title={'By Gender'} />
              <div className={styles.byGender}>
                <div className={styles.byGender__stats}>
                  <div className={styles.byGender__stats__percentage} >
                    <div className={styles.byGender__stats__percentage_left}>
                      <Icon icon="user-o" />
                      <span className={styles.byGender__stats__percentage__count}>68%</span>
                    </div>
                    <span className={styles.byGender__stats__percentage_left} >Male</span>
                  </div>
                  <div className={styles.byGender__stats__percentage} >
                    <div className={styles.byGender__stats__percentage_right}>
                      <Icon icon="user-o" />
                      <span>32%</span>
                    </div>
                    <span className={styles.byGender__stats__percentage_right} >Famale</span>
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

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={6}>
            <Card borderColor={colorMap.primaryBlue} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="By Age" />
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

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={12}>
            <Card borderColor={colorMap.primaryBlue} className={styles.fans}>
              <span className={styles.fans__primaryBlue}>Woman</span> between age of
              <span className={styles.fans__primaryBlue}>35-44</span>
              appear to be the leader force among your fans
            </Card>
          </Col>

          <Col className={styles.margin} xs={12} sm={6}>
            <Card className={styles.booked} borderColor={colorMap.primaryBlue}>
              <div className={styles.booked__header}>
                <CardHeader title={"Twitter audience"} />
              </div>
            <div className={styles.booked__body}>
              <LineChart
                displayTooltips={true}
                labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
                dataSets={[
                  {
                    label: 'Appointments Booked',
                    color: 'yellow',
                    data: [125, 150, 143, 200, 180, 220, 300 ],
                  }
                ]}
              />
            </div>
            </Card>
          </Col>

          <Col className={styles.margin} xs={12} sm={6}>
            <ContainerList borderColor={colorMap.primaryBlue}
               cardTitle="Top Cities"
               data={[{
                 title: "Vancouver, BC, Canada",
                 hours: 160
               },{
                 title: "Calgary, AB, Canada",
                 hours: 153
               },{
                 title: "Toronto, ON, Canada",
                 hours: 111
               },{
                 title: "Winnipeg, MB, Canada",
                 hours: 97
               },{
                 title: "Surrey, BC, Canada",
                 hours: 62
               }]} 
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Social;
