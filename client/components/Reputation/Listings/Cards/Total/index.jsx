import React, { Component, PropTypes } from 'react';
import { Card, Icon } from '../../../../library';
import styles from './styles.scss';

class Total extends Component {
  render() {
    const {
      borderColor,
      data,
    } = this.props;

    const allDataCount = data.reduce((sum, cur) => sum + cur.count, 0);
    return (
      <Card
        borderColor={borderColor}
        className={styles.total}>
        <div className={styles.total__header}>
          {data.map((obj, i) => (
            <div
              key={i}
              className={styles.total__header_list}>
              <div className={styles.total__header_item}>
                <div className={styles.total__item}>
                  <div className={styles.total__header_wrapper}>
                    <Icon className={`${styles.total__header_icon} ${styles[`fa-${obj.icon}`]}`} icon={obj.icon} />
                  </div>
                  <span className={styles.total__header_text}>{obj.title}</span>
                </div>
                <div className={`${styles.total__item} ${styles[`fa-${obj.icon}`]}`}>
                  {obj.count}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.total__body}>
          <div className={styles.total__body_total}>
            <span>Total Listing Sources</span>
            <span>{allDataCount}</span>
          </div>
        </div>
      </Card>
    );
  }
}

Total.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
export default Total;
