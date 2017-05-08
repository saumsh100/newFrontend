import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox, CheckboxImage } from '../../../../library';

export default function FilterPractitioners(props) {

  const {
    filterKey,
    allChecked,
    practitioners,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
  } = props;

  const colorArray = ['primaryColor', 'primaryYellow', 'primaryGreen', 'primaryBlueGreen' ]
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
          onChange={ () => handleAllCheck(filterKey)}
        />
        {practitioners.map((pr, i) => {
          const checked = selectedFilterItem.indexOf(pr.id) > -1;
          const label = (<div className={styles.filter_practitioner__name}>{pr.firstName}</div>);

          let hideCheck = checked;
          return (
            <div key={pr.id} className={styles.filter_practitioner__list}>
              <CheckboxImage
                key={pr.id}
                checked={hideCheck}
                onChange={() => { handleEntityCheck(checked, pr.id, filterKey, hideCheck); }}
                id={`checkbox-${i}`}
                label={label}
                imgColor={colorArray[i]}
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
