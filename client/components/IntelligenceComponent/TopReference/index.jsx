import React, { Component } from 'react';
import Item from './Item'
import styles from './styles.scss';

class TopReference extends Component {
  render() {
    const hardcodeData = [{
      img: "images/practitioner_1.png",
      name: "Jehn Frue",
      age: "30",
      number: 7,
    },{
      img: "images/practitioner_1.png",
      name: "Liz Mcmahon",
      age: "21",
      number: 5,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Brune",
      age: "47",
      number: 5,
    },{
      img: "images/practitioner_1.png",
      name: "Monica Lee",
      age: "54",
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
