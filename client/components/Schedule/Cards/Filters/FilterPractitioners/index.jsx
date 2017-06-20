
import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox, CheckboxImage } from '../../../../library';
import { SortByFirstName } from '../../../../library/util/SortEntities';

export default function FilterPractitioners(props) {
  const {
    filterKey,
    allChecked,
    practitioners,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
  } = props;

  if (!practitioners) {
    return null;
  }
  const colors = ['primaryColor', 'primaryYellow', 'primaryGreen', 'primaryBlueGreen'];
  const colorLen = colors.length;
  const colorArray = [];

  let practitionersSort = practitioners.toArray().sort(SortByFirstName);

  const reset = Math.ceil((practitionersSort.length - colorLen) / colorLen);

  for (let j = 0; j <= reset; j++) {
    for (let i = 0; i < colorLen; i++) {
      colorArray.push(colors[i]);
    }
  }

<<<<<<< HEAD

  practitionersSort = practitionersSort.map((prac, index) => Object.assign({}, prac.toJS(), {
    color: colorArray[index],
  }));
=======
  practitionersSort = practitionersSort.map((prac, index) => {
    return Object.assign({}, prac.toJS(), {
      color: colorArray[index],
    });
  });
>>>>>>> 21cd7fa3b50244d15d2aee67f9b88b17724c91f1

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
        {practitionersSort.map((pr, i) => {
          const checked = selectedFilterItem.indexOf(pr.id) > -1;
          const label = (<div className={styles.filter_practitioner__name}>Dr. {pr.firstName}</div>);
          const url = (pr.fullAvatarUrl ? pr.fullAvatarUrl.replace('[size]', 400) : null)
          if (!pr) {
            return null;
          }

          return (
            <div key={pr.id} className={styles.filter_practitioner__list}>
              <CheckboxImage
                key={pr.id}
                checked={checked}
                onChange={() => { handleEntityCheck(checked, pr.id, filterKey); }}
                id={`checkbox-${i}`}
                label={label}
                imgColor={pr.color}
                url={url}
                firstName={pr.firstName}
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
