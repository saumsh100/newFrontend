import React, { Component } from 'react';
import { Guage, PractitionerAvatar } from '../../../../library';
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
      practitioner,
      percentage } = this.props;
    return (
      <li className={styles.practitioner__item}>
        <div className={styles.practitioner__item_wrapper}>
          <div className={styles.practitioner__item_header}>
            <div className={styles.practitioner__item_img}>
              <PractitionerAvatar size="lg" practitioner={practitioner} />
            </div>
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
              <span>Productivity Hours Booked</span>
              <span>{appointmentBooked}h</span>
            </div>
            <div className={styles.practitioner__item_text}>
              <span>Productivity Hours Not Filled</span>
              <span>{appointmentNotFiltred}h</span>
            </div>
            <div className={styles.practitioner__item_text}>
              <span>New Patients</span>
              <span>{newPatients}</span>
            </div>
          </div>
          <Guage percentage={percentage} width={100} height={100} />
        </div>
      </li>
    );
  }
}


export default PractitionersList;
