import React, { PropTypes } from 'react';
import moment from 'moment';
import { v4 } from 'node-uuid'
import styles from './styles.scss';

const DialogComponent = props => (
  <div>
    {props.messages.get('models')
    .filter((el) => el.patientId === props.patientId)
    .sort((a, b) => a.createdAt > b.createdAt)
    .map(m => <ul key={v4()} className={`${styles.message} ${props.patientId === m.patientId ? styles.left : styles.right}`}>
      <li className={styles.message__item}>
        <div className={styles.message__wrapper}>
          <div className={styles.message__time}>
            { moment(m.createdAt).fromNow() }
          </div>
          <div className={styles.message__text}>
            { m.body }
          </div>
          <img className={styles.message__avatar} src="https://randomuser.me/api/portraits/women/70.jpg" alt="avatar" />
        </div>
      </li>
    </ul>)}
  </div>
);

DialogComponent.propTypes = {
  patientId: PropTypes.string,
  messages: PropTypes.object,
};

export default DialogComponent;
