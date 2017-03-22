import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row, DashboardStats} from "../../library";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import styles from "./styles.scss";

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
          <Col className={styles.social__body} xs={12}>
            <Col className={styles.social__header} xs={12}>
              <Card className={styles.social__header_title}>
                <b>Overview</b>
              </Card>
            <DashboardStats data={data} />
          </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Social;
