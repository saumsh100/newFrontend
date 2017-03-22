import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row,} from "../../library";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import styles from "./styles.scss";

class Social extends Component {
  render() {
    return (
      <Grid className={styles.intelligence}>
        <Row>
          <Col className={styles.intelligence__header} xs={12}>
            <Card className={styles.intelligence__header_title}>
              <b>Social</b>
            </Card>
            <DashboardStats/>
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

export default Social;
