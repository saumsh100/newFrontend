import React, { Component } from 'react';
import Item from './Item'
import styles from './styles.scss';


class TopReference extends Component {
  render() {
    const hardcodeData = [[{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },],[{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    }],[{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Konner Beck",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Syndee Hart",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    },{
      img: "images/practitioner_1.png",
      name: "Syndee Hart",
      age: "2",
      cardTitle: "Top referrers",
      number: 4,
    }]];
    return (
      <div className={styles.patients}>
        {hardcodeData.map(obj => {
          return (
            <Item className={styles.patients__item} data={obj}/>
          )
        })}
      </div>
    );
  }
}


export default TopReference;
