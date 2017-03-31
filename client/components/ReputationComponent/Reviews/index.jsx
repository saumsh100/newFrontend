import React, { PropTypes, Component } from 'react';
import { Card, Col, Grid, Row } from '../../library';
import Score from './Score';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';

class Reviews extends Component {
  render() {
    return (
      <Grid className={styles.reviews}>
        <Row>
          <Col xs={3}>
            <Score
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
