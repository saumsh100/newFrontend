import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../library';
import Search from '../../library/Search';
import styles from './styles.scss';
import moment from 'moment';

class RemindersList extends Component {
  render() {
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
            {this.props.data.map(obj => {
              const rightContent = obj.appointment && typeof obj.appointment === "object" ?
                <div className={styles.patients__item_right}>
                  <div className={styles.availability}>
                    Availability
                  </div>
                  <div className={styles.patients__item_days}>
                    {obj.appointment.days.map(d => (<span>{d}</span>))}
                  </div>
                  Except
                  <div className={styles.patients__item_days}>
                    {obj.appointment.except.map(e => (
                      <span>{moment(e).format("m/d")}</span>))}
                  </div>
                </div>
                :
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
                    {rightContent}
                  </div>
                  <div className={styles.patients__item_icon}>
                    <Icon className={obj.icon} icon={obj.icon} size={1.5}/>
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
