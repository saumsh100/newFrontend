import React, { PropTypes, Component } from 'react';
import { Card, Col, Grid, Row } from '../../library';
import Score from './Score';
import Total from './Total';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';


class Reviews extends Component {
  render() {
    return (
      <Grid className={styles.reviews}>
        <Row>
          <Col className={styles.padding} xs={12} md={3}>
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
        </Row>
      </Grid>
    );
  }
}

export default Reviews;
