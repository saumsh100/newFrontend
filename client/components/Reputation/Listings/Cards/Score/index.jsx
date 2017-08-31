import React, { Component, PropTypes } from 'react';
import { Card } from '../../../../library';
import styles from './styles.scss';

class Score extends Component {
  render() {
    const {
      title,
      data,
      borderColor,
      listingScore
    } = this.props;

    return (
      <Card className={styles.score}>
        <div className={styles.score__header}>
          <div className={styles.score__header_count}>
            {listingScore.toFixed(0)}
          </div>
          <div className={styles.score__header_title}>
            {title}
          </div>
        </div>
        <div className={styles.score__body}>
          {data.map((obj, i) => (
            <div
              key={i}
              className={styles.score__body_listing}>
              <span>{obj.title}</span>
              <span>{obj.count}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  }
}
Score.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  count: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};
export default Score;
