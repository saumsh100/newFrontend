import React, { Component } from 'react';
import {  Guage  } from '../../library';
import styles from './styles.scss';


class PractitionersList extends Component {
  render() {
    const {
      img,
      name,
      profession,
      appointmentBooked,
      appointmentNotFiltred,
      newPatients,
      percentage  } = this.props;
    return (
      <li className={styles.practitioner__item}>
        <div className={styles.practitioner__item_wrapper}>
          <div className={styles.practitioner__item_header}>
            <img className={styles.practitioner__item_img} src={img} alt=""/>
            <div className={styles.practitioner__item_about}>
              <div className={styles.practitioner__item_name}>
                <b>{name}</b>
              </div>
              <div className={styles.practitioner__item_profession}>
                {profession}
              </div>
            </div>
          </div>
          <div className={styles.practitioner__item_footer}>
            <div className={styles.practitioner__item_text}>
              <span>Appointments Booked</span>
              <span>{appointmentBooked}</span>
            </div>
            <div className={styles.practitioner__item_text}>
              <span>Appointments Not Filled</span>
              <span>{appointmentNotFiltred}</span>
            </div>
            <div className={styles.practitioner__item_text}>
              <span>New Patients</span>
              <span>{newPatients}</span>
            </div>
          </div>
          <Guage percentage={percentage} width={100} height={100}/>
        </div>
      </li>
    );
  }
}


export default PractitionersList;
