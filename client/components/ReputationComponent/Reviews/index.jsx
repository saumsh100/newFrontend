import React, { PropTypes, Component } from 'react';
import { Card, Col, Grid, Row, CardHeader, Star } from '../../library';
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

          <Col className={styles.padding} xs={12} md={12}>
            <Card borderColor={colorMap.red} className={styles.card}>
              <div className={styles.googleMapsRespond}>
                <div className={styles.googleMapsRespond__video}>
                  <iframe width="250" height="120"
                  src="https://www.youtube.com/watch?v=t13DULDt01k">
                  </iframe>
                </div>
                <div className={styles.googleMapsRespond__descr}>
                  <div> Respond to google maps review </div>
                  <div> You can respond from here! Connect your Google My Busyness account to get started </div>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col className={styles.padding} xs={4} md={4}>
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >4.7</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  <Star />
                  <Star />
                </div>
                <span className={styles.stats__bottom}>Industry Average 4.1/5</span>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={4} md={4}>
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >12</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  0 With no start rating
                </div>
                <span className={styles.stats__bottom}>Industry Average 106</span>
              </div>
            </Card>
          </Col>
          
          <Col className={styles.padding} xs={4} md={4} >
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >4.7</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  <Star />
                  <Star />
                </div>
              </div>
            </Card>
          </Col>
          


        </Row>
      </Grid>
    );
  }
}

export default Reviews;
