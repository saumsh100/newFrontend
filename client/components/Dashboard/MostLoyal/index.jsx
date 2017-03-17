import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../library';
import styles from './styles.scss';


class MostLoyal extends Component {
  render() {
    const hardcodeData = [{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      loyalNumber: 25,
      appointmentNumber: 10,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "24",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      loyalNumber: 4,
      appointmentNumber: 26,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      loyalNumber: 18,
      appointmentNumber: 54,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      loyalNumber: 75,
      appointmentNumber: 41,
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      loyalNumber: 43,
      appointmentNumber: 13,
    }];
    const {
      cardCount,
      cardTitle,
    } = this.props;
    return (
      <Card className={styles.mostLoyal}>
        <div className={styles.mostLoyal__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.mostLoyal__body}>
          <List className={styles.data}>
            {hardcodeData.map(obj => {
              return (
                <ListItem className={styles.data__item}>
                  <div className={styles.data__item_wrapper}>
                    <div className={styles.data__item_left}>
                      <img className={styles.data__item_img} src={obj.img} alt=""/>
                      <div className={styles.data__item_personal}>
                        <div className={styles.data__item_name}>
                          <b>{obj.name}, <span>{obj.age}</span></b>
                        </div>
                        <div className={styles.data__item_phone}>
                          {obj.phone}
                        </div>
                        <div className={styles.data__item_email}>
                          {obj.email}
                        </div>
                      </div>
                      <div className={styles.data__item_loyal}>
                        <div className={styles.loyal__number}>
                          {obj.loyalNumber}
                        </div>
                        <div className={styles.loyal__text}>
                          <div>PATIENT</div>
                          <div>LOYALTY</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.data__item_right}>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
                      <div className={styles.data__item_table}>
                        <div className={styles.table__number}>
                          {obj.appointmentNumber}
                        </div>
                        <div className={styles.table__text}>
                          <div>TOTAL</div>
                          <div>APPOINTMENTS</div>
                        </div>
                      </div>
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


export default MostLoyal;
