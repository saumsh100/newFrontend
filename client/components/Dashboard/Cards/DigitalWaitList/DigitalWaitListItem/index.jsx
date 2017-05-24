
import React, { Component } from 'react';
import moment from 'moment';
import { ListItem, Icon } from '../../../../library';
import styles from './styles.scss';

const DigitalWaitListItem = (obj, index) => (
  <ListItem key={`patientsItem${index}`} className={styles.patients__item}>
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
      {/*<div key={`appointments${index}`} className={styles.patients__item_right}>
        <div className={styles.availability}>
          Availability
        </div>
        <div className={styles.patients__item_days}>
          {obj.appointment.days.map((d,i) => (<span key={i}>{d}</span>))}
        </div>
        Except
        <div className={styles.patients__item_days}>
          {obj.appointment.except.map((e,i) => (
            <span key={i}>{moment(e).format("m/d")}</span>))}
        </div>
      </div>*/}
    </div>
    <div className={styles.patients__item_icon}>
      <Icon className={styles[`fa-${obj.icon}`]} icon={obj.icon} size={1.5}/>
    </div>
  </ListItem>
);

export default DigitalWaitListItem;
