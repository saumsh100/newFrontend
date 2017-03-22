import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row,} from "../../library";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import styles from "./styles.scss";

class Social extends Component {
  render() {
    return (
      <Grid className={styles.social}>
        <Row>
          <Col className={styles.business__header} xs={12}>
            <Card className={styles.business__header_title}>
              <b>Social</b>
            </Card>
          </Col>
          <Col className={styles.social__body} xs={12}>
            <Row>
              <Col className={styles.social__body_arrows} xs={4}>

              </Col>
              <Col className={styles.social__body_arrows} xs={4}>

              </Col>
              <Col className={styles.social__body_arrows} xs={4}>


              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Social;
