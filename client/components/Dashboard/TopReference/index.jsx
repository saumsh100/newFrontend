import React, { Component } from 'react';
import Item from './Item'
import styles from './styles.scss';

class TopReference extends Component {
  render() {
    const hardcodeData = [{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      number: 4,
    }];
    const { borderColor } = this.props;
    return (
      <div className={styles.patients}>
          <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Top Referrers" data={hardcodeData}/>
          <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Most Confirmed Referrals" data={hardcodeData}/>
          <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Most Appointments" data={hardcodeData}/>
          <Item className={styles.patients__item} borderColor={borderColor} cardTitle="Most Business" data={hardcodeData}/>
      </div>
    );
  }
}


export default TopReference;
