import React, { Component, PropTypes } from 'react';
import { Card } from '../../../library';
import styles from './styles.scss';

class Score extends Component {
  render() {
    const {
      title,
      count,
      borderColor,
    } = this.props;
    const data = [
      { title: 'Industry Avg', count: 404 },
      { title: 'Industry Avg', count: 404 },
    ];
    return (
      <Card borderColor={borderColor}
            className={styles.score}>
        <div className={styles.score__header}>
          <div className={styles.score__header_count}>
            {count}
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
  count: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};
export default Score;
