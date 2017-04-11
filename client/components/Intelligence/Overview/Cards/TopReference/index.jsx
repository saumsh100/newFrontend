import React, { Component } from 'react';
import Item from './Item';
import styles from './styles.scss';

class TopReference extends Component {
  render() {
    const {
      borderColor,
      data,
    } = this.props;
    return (
      <div className={styles.patients}>
        <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Top Referrers" data={data} />
        <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Most Confirmed Referrals" data={data} />
        <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Most Appointments" data={data} />
        <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Most Business" data={data} />
      </div>
    );
  }
}


export default TopReference;
