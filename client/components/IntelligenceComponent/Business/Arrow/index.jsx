import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row,} from "../../../library";
import colorMap from "../../../library/util/colorMap";
import classNames from 'classnames';
import styles from "./styles.scss";

class Arrow extends Component {
  render() {
    return (
      <Grid className={styles.arrow}>
        <Row>
          <Col className={styles.arrow__header} xs={12}>
            <div className={styles.arrow__header_title}>
              <b>Social</b>
            </div>
          </Col>
          <Col xs={12}>
            <Row>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Arrow;
