import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { Card, Col, Grid, Row, DashboardStats, CardHeader, BarChart, PieChart, ContainerList, LineChart, Icon } from "../../library";
import BackgroundIcon from '../../library/BackgroundIcon';
import colorMap from '../../library/util/colorMap';
import SocialOverview from './Cards/SocialOverview';
import ByGender from './Cards/ByGender';
import ByAge from './Cards/ByAge';
import Audience from './Cards/Audience';
import styles from './styles.scss';

class Social extends Component {
  render() {
    const data = [
      {count: 388, title: "Facebook likes", icon: "facebook", size: 6, color: 'darkblue' },
      {count: "11k", title: "Twitter followers", icon: "twitter", size: 6, color: 'lightblue' },
      {count: 143, title: "Google +", icon: "google-plus", size: 6, color: 'primaryRed' },
      {count: 671, title: "Instagram followers", icon: "instagram", size: 6, color: 'primaryYellow' },
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
            <SocialOverview
              title='Facebook Overview'
              impressions={'2,493,840'}
              engagements={'2,493,840'}
              clicks={'2,493,840'}
            />
          </Col>
          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={6}>
            <ByGender
              maleCount={32}
              femaleCount={68}
              labels={["18-24", "25-34", "35-44", "45-54", "55+"]}
              data={[{ value: 68, color: "blue" }, { value: 32, color: "green" }]}
            />
          </Col>

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={6}>
            <ByAge
              labels={["18-24", "25-34", "35-44", "45-54", "55+"]}
              data={[18, 25, 35, 45, 55 ]}
            />
          </Col>

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={12}>
            <Card borderColor={colorMap.darkblue} className={styles.fans}>
              <span className={styles.fans__between}>Woman</span> between age of
              <span className={styles.fans__between}>35-44</span>
              appear to be the leader force among your fans
            </Card>
          </Col>

          <Col className={styles.margin} xs={12} sm={6}>
            <Audience
              title="Facebook Audience"
              labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
              data={[125, 150, 143, 200, 180, 220, 300 ]}
            />
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
            <SocialOverview
              title='Twitter Overview'
              impressions={'2,493,840'}
              engagements={'2,493,840'}
              clicks={'2,493,840'}
            />
          </Col>

          <Col className={classNames(styles.padding, styles.margin)} xs={12} md={12}>
            <Card borderColor={colorMap.primaryBlue} className={styles.fans}>
              <span className={styles.fans__primaryBlue}>Woman</span> between age of
              <span className={styles.fans__primaryBlue}>35-44</span>
              appear to be the leader force among your fans
            </Card>
          </Col>

          <Col className={styles.margin} xs={12} sm={6}>
            <Audience
              title="Twitter Audience"
              labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
              data={[125, 150, 143, 200, 180, 220, 300 ]}
            />
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
