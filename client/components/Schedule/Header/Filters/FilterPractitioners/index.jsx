import PropTypes from 'prop-types';
import React from 'react';
import styles from '../reskin-styles.scss';
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

  const colors = [
    'salmon200',
    'lavender200',
    'yellow200',
    'teal200',
    'salmon200',
    'lavender200',
    'yellow200',
    'teal200',
  ];
  const colorLen = colors.length;
  const colorArray = [];

  let practitionersSort;

  if (Array.isArray(practitioners)) {
    practitionersSort = practitioners.sort(SortByFirstName);
  } else {
    practitionersSort = practitioners.toArray().sort(SortByFirstName);
  }

  const reset = Math.ceil((practitionersSort.length - colorLen) / colorLen);

  for (let j = 0; j <= reset; j += 1) {
    for (let i = 0; i < colorLen; i += 1) {
      colorArray.push(colors[i]);
    }
  }

  practitionersSort = practitionersSort.map((practitioner, index) => ({
    ...(practitioner.toJS ? practitioner.toJS() : practitioner),
    color: colorArray[index],
  }));

  return (
    <div>
      <div className={styles.filter_options__title}>Practitioners:</div>
      <ul className={styles.filter_practitioner__wrapper}>
        <Checkbox
          hidden
          label="All"
          checked={allChecked}
          onChange={() => handleAllCheck(filterKey)}
        />
        {practitionersSort.map((pr, i) => {
          if (!pr) {
            return null;
          }

          const displayName =
            pr.type === 'Dentist'
              ? `Dr. ${pr.lastName || pr.firstName}`
              : `${pr.firstName} ${pr.lastName || ''}`;
          const checked = selectedFilterItem.indexOf(pr.id) > -1;

          const label = (
            <div className={styles.filter_practitioner__name}>
              {displayName}
              <div className={styles.filter_practitioner__type}>{pr.type}</div>
            </div>
          );
          const url = pr.fullAvatarUrl ? pr.fullAvatarUrl.replace('[size]', 400) : null;
          return (
            <div key={pr.id} className={styles.filter_practitioner__list}>
              <CheckboxImage
                key={pr.id}
                checked={checked}
                onChange={() => {
                  handleEntityCheck(checked, pr.id, filterKey);
                }}
                id={`checkbox-${i}`}
                label={label}
                imgColor={pr.color}
                url={url}
                firstName={pr.firstName}
                imageSrc="https://randomuser.me/api/portraits/men/44.jpg"
                alt="practitioner"
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
}

FilterPractitioners.propTypes = {
  filterKey: PropTypes.string.isRequired,
  allChecked: PropTypes.bool.isRequired,
  practitioners: PropTypes.shape.isRequired,
  selectedFilterItem: PropTypes.arrayOf.isRequired,
  handleAllCheck: PropTypes.func.isRequired,
  handleEntityCheck: PropTypes.func.isRequired,
};
