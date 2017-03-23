import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row,} from "../../library";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import Arrow from './Arrow';
import styles from "./styles.scss";

class Business extends Component {
  render() {
    return (
      <Grid className={styles.business}>
        <Row>
          <Col className={styles.business__header} xs={12}>
            <Card className={styles.business__header_title}>
              <b>Business</b>
            </Card>
          </Col>
          <Col className={styles.business__body} xs={12}>
            <Row>
              <Col className={styles.business__body_arrows} xs={4}>
                <Arrow />
              </Col>
              <Col className={styles.business__body_arrows} xs={4}>
                <Arrow />
              </Col>
              <Col className={styles.business__body_arrows} xs={4}>
                <Arrow />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Business;
