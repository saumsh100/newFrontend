import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';

export default function FilterPractitioners(props) {

  const {
    practitioners,
    handleCheckDoctor,
    selectedFilterPractitioners,
  } = props;


  return (
    <div>
      <div className={styles.filter_practitioner__title}>
        Practitioner
      </div>
      <ul className={styles.filter_practitioner__wrapper}>
        {practitioners.map((pr, i) => {
          const checked = selectedFilterPractitioners.indexOf(pr.id) > -1;
          return (
            <div key={pr.id} className={styles.filter_practitioner__list}>
              <input
                className={styles.filter_practitioner__checkbox}
                type="checkbox" checked={checked} id={`checkbox-${i}`}
                onChange={() => { handleCheckDoctor(pr.id, checked); }}
              />
              <label className={styles.filter_practitioner__label} htmlFor={`checkbox-${i}`}>
                <li className={styles.filter_practitioner__item}>
                  <img className={styles.filter_practitioner__photo} src="https://randomuser.me/api/portraits/men/44.jpg" alt="practitioner" />
                  <div className={styles.filter_practitioner__name}>{pr.firstName}</div>
                  <div className={styles.filter_practitioner__spec}>Dentist</div>
                </li>
              </label>
            </div>
          );
        })}
      </ul>
    </div>
  );

}

FilterPractitioners.PropTypes = {

};
