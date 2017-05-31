import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox, CheckboxImage } from '../../../../library';

const sortPractitionersAlphabetical = (a, b) => {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

export default function FilterPractitioners(props) {

  const {
    filterKey,
    allChecked,
    practitioners,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
  } = props;

  const colorArray = ['primaryColor', 'primaryYellow', 'primaryGreen', 'primaryBlueGreen' ];

  return (
    <div>
      <div className={styles.filter_practitioner__title}>
        Practitioner
      </div>
      <ul className={styles.filter_practitioner__wrapper}>
        <Checkbox
          hidden
          label={'All'}
          checked={allChecked}
          onChange={() => handleAllCheck(filterKey)}
        />
        {practitioners.toArray().map((pr, i) => {
          const checked = selectedFilterItem.indexOf(pr.id) > -1;
          const label = (<div className={styles.filter_practitioner__name}>Dr. {pr.firstName}</div>);

          return (
            <div key={pr.id} className={styles.filter_practitioner__list}>
              <CheckboxImage
                key={pr.id}
                checked={checked}
                onChange={() => { handleEntityCheck(checked, pr.id, filterKey); }}
                id={`checkbox-${i}`}
                label={label}
                imgColor={colorArray[i]}
                imageSrc="https://randomuser.me/api/portraits/men/44.jpg" alt="practitioner"
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
}




FilterPractitioners.PropTypes = {

};
