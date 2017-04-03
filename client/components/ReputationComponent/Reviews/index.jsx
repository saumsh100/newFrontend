import React, { PropTypes, Component } from 'react';
import { Card, Col, Grid, Row, CardHeader, Star, Tag } from '../../library';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';
import _ from 'lodash';

class Reviews extends Component {
  render() {

    const rating = {
      5: 11,
      4: 0,
      3: 0,
      2: 0,
      1: 1,
    }

    const ratingStars = _.keys(rating).sort((a,b) => a > b);
    const maxValue = _.max(_.values(rating));

    return (
      <Grid className={styles.reviews}>
        <Row>
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

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >4.7</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  <Star size={1.3} />
                  <Star size={1.3} />
                </div>
                <span className={styles.stats__bottom}>Industry Average 4.1/5</span>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
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

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                  {ratingStars.map(r => {
                    const rows = [];
                    for(let i = 1; i <= r; i++ ) {
                      rows.push(<Star size={1.3} />);
                    }
                    const width = rating[r] ? (Math.floor((rating[r] / maxValue) * 80)) : 5;
                    const style = { width: `${width}%` };
                    return (
                      <div className={styles.content}>
                        <div className={styles.content__stars}>
                          {rows}
                        </div>

                        <div className={styles.content__bar}>
                          <span
                            style={style}
                            className={styles.content__bar__percent}>
                          </span>
                          {rating[r]}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Card>
          </Col>


          <Col className={styles.padding} xs={12} md={12}>
            <Card borderColor={colorMap.yellow} className={styles.card}>
              <div className={styles.tags}>
                <div className={styles.tags__left}>
                  <Tag label="dentist" color={colorMap.blue}  />
                  <Tag label="dentist vancouver" color={colorMap.red} />
                  <Tag label="dentist kitsilano" color={colorMap.yellow} />
                  <Tag label="dentist hygienist" color={colorMap.green} />

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
