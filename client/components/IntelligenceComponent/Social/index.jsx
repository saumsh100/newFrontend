import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row, DashboardStats, CardHeader, BarChart, PieChart, ContainerList } from "../../library";
import BackgroundIcon from "../../library/BackgroundIcon";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import styles from "./styles.scss";


console.log("BackgroundIcon")
console.log(BackgroundIcon)

class Social extends Component {
  render() {
    const data = [
      {count: 388, title: "Facebook likes", icon: "facebook", size: 10, color: 'primaryBlue' },
      {count: "11k", title: "Twitter followers", icon: "twitter", size: 10, color: 'primaryBlue' },
      {count: 143, title: "Google +", icon: "bullhorn", size: 10, color: 'primaryGreen' },
      {count: 671, title: "Instagram followers", icon: "star", size: 10, color: 'primaryYellow' },
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
                    <span className={classNames(styles.visitors__text, styles.font24, styles.fontWeight800, styles.marginTop20, styles.marginBottom10)}>2,493,840</span>
                    <span className={classNames(styles.colorGrey, styles.font24, styles.fontWeight200)}>Impressions</span>
                  </div>
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="heart" backgroundClassName="backgroundColorDarkBlue" />
                    <span className={classNames(styles.visitors__text, styles.font24, styles.fontWeight800, styles.marginTop20, styles.marginBottom10)}>2,493,840</span>
                    <span className={classNames(styles.colorGrey, styles.font24, styles.fontWeight200)}>Engagements</span>
                  </div>
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="location-arrow" backgroundClassName="backgroundColorDarkGrey" />
                    <span className={classNames(styles.visitors__text, styles.font24, styles.fontWeight800, styles.marginTop20, styles.marginBottom10)}>2,493,840</span>
                    <span className={classNames(styles.colorGrey, styles.font24, styles.fontWeight200)}>Clicks</span>
                  </div>
                  
                </div>
              </div>
            </Card>
          </Col>


          <Col className={styles.padding} xs={12} md={12}>
            <Card borderColor={colorMap.darkblue} className={styles.card}>
              <CardHeader className={styles.cardHeader} title="Twitter activity overview" />
              <div className={styles.facebookActivity} >
                <div className={styles.facebookActivity__container} >
                  <div className={styles.iconsContainer} >
                    <BackgroundIcon icon="eye" backgroundClassName="backgroundColorGrey" />
                    <span className={classNames(styles.visitors__text, styles.font24, styles.fontWeight800, styles.marginTop20, styles.marginBottom10)}>2,493,840</span>
                    <span className={classNames(styles.colorGrey, styles.font24, styles.fontWeight200)}>Impressions</span>
                  </div>
                  <div className={classNames(styles.visitors__item, styles.columnContainer, styles.justifyCenter)} >
                    <BackgroundIcon icon="heart" backgroundClassName="backgroundPowderBlue" />
                    <span className={classNames(styles.visitors__text, styles.font24, styles.fontWeight800, styles.marginTop20, styles.marginBottom10)}>2,493,840</span>
                    <span className={classNames(styles.colorGrey, styles.font24, styles.fontWeight200)}>Engagements</span>
                  </div>
                  <div className={classNames(styles.visitors__item, styles.columnContainer, styles.justifyCenter)} >
                    <BackgroundIcon icon="location-arrow" backgroundClassName="backgroundColorDarkGrey" />
                    <span className={classNames(styles.visitors__text, styles.font24, styles.fontWeight800, styles.marginTop20, styles.marginBottom10)}>2,493,840</span>
                    <span className={classNames(styles.colorGrey, styles.font24, styles.fontWeight200)}>Clicks</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={6}>
            <Card borderColor={colorMap.darkblue}>
              <CardHeader className={styles.cardHeader} title={'By gender'} />
              <div className={styles.byGender}>
                <div className={styles.byGender__stats}>
                  <div className={styles.byGender__stats__percentage} >
                    <span className={styles.byGender__stats__percentage_left} >62.3%</span>
                    <span className={styles.byGender__stats__percentage_left} >Famale</span>
                  </div>
                  <div className={styles.byGender__stats__percentage} >
                    <span className={styles.byGender__stats__percentage_right} >62.3%</span>
                    <span className={styles.byGender__stats__percentage_right} >Male</span>
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
            <Card borderColor={colorMap.darkblue} className={styles.card}>
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


          <Col xs={12} sm={6}>
            <ContainerList borderColor={colorMap.darkblue}
              cardTitle="Top Cities"
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
      </Grid>
    );
  }
}

export default Social;
