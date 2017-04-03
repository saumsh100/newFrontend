import React, { PropTypes, Component } from 'react';
import { Col, Grid, Row } from '../../library';
import colorMap from '../../library/util/colorMap';
import Score from "./Score";
import Total from "./Total";
import Information from "./Information";
import styles from './styles.scss';

class Listings extends Component {
  render() {
    return (
      <Grid className={styles.listings}>
        <Row>
          <Col className={styles.padding} xs={12} md={4}>
            <Score
              borderColor={colorMap.blue}
              count="232"
              title="Listing Score"
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Total
              borderColor={colorMap.blue}
              count="232"
              title="Listing Score"
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Information
              borderColor={colorMap.blue}
              count="232"
              title="Listing Score"
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Listings;
