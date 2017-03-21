import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../library';
import Search from '../../library/Search';
import styles from './styles.scss';


class RemindersList extends Component {
  render() {
    const hardcodeData = [{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "24",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/2000",
      time: "18:00pm",
      icon: "phone"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "envelope"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "envelope"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "phone"
    }];
    const {
      borderColor,
      cardCount,
      cardTitle,
    } = this.props;
    return (
      <Card className={styles.reminders} borderColor={borderColor}>
        <div className={styles.reminders__header}>
          <CardHeader count={cardCount} title={cardTitle}>
            <Search />
          </CardHeader>
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {hardcodeData.map(obj => {
              return (
                <ListItem className={styles.patients__item}>
                  <img className={styles.patients__item_img} src={obj.img} alt=""/>
                  <div className={styles.patients__item_wrapper}>
                    <div className={styles.patients__item_left}>
                      <div className={styles.patients__item_name}>
                        <b>{obj.name}, <span>{obj.age}</span></b>
                      </div>
                      <div className={styles.patients__item_phone}>
                        {obj.phone}
                      </div>
                      <div className={styles.patients__item_email}>
                        {obj.email}
                      </div>
                    </div>
                    <div className={styles.patients__item_right}>
                      <div className={styles.patients__item_status}>
                        {obj.status}
                      </div>
                      <div className={styles.patients__item_date}>
                        {obj.date}
                      </div>
                      <div className={styles.patients__item_time}>
                        {obj.time}
                      </div>
                    </div>
                    <div className={styles.patients__item_icon}>
                      <Icon className={obj.icon} icon={obj.icon} size={1.5}/>
                    </div>
                  </div>
                </ListItem>
              )
            })}
          </List>
        </div>
      </Card>
    );
  }
}


export default RemindersList;
