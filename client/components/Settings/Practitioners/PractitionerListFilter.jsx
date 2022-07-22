import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { StandardButton as Button, DropdownMenu, MenuItem } from '../../library';
import styles from './styles.scss';
import { practitionerShape } from '../../library/PropTypeShapes';

export const practitionerFilterOptions = {
  'All Practitioners': {
    label: 'All',
    filter: (practitioners) => practitioners,
  },
  'Active Practitioners': {
    label: 'Active',
    filter: (practitioners) =>
      practitioners.filter((practitioner) => practitioner.isActive === true),
  },
  'Inactive Practitioners': {
    label: 'Inactive',
    filter: (practitioners) =>
      practitioners.filter((practitioner) => practitioner.isActive === false),
  },
};

export default function PractitionerListFilter(props) {
  const { practitionerCount } = props;
  function menuItemClickHandler(name) {
    props.updateFilter({
      name,
      filterFunction: practitionerFilterOptions[name].filter,
    });
  }

  return (
    <DropdownMenu
      align="left"
      className={styles.practitionerListFilter}
      labelComponent={(cb) => (
        <Button {...cb} iconRight="caret-down" variant="secondary" className={styles.button}>
          <div className={styles.button_content}>
            <p>{props.filterName}</p> <div className={styles.button_badge}>{practitionerCount}</div>
          </div>
        </Button>
      )}
    >
      <div className={styles.menuListWrapper}>
        {Object.entries(practitionerFilterOptions).map((opt) => {
          const [name, obj] = opt;
          const selectedStyle = name === props.filterName && styles.MenuItemSelected;
          return (
            <MenuItem
              className={classNames(styles.practitionerListFilterMenuItem, selectedStyle)}
              onClick={() => menuItemClickHandler(name)}
            >
              {obj.label}
              <div className={styles.menuItemCount}>{obj.filter(props.practitioners).size}</div>
            </MenuItem>
          );
        })}
      </div>
    </DropdownMenu>
  );
}

PractitionerListFilter.propTypes = {
  filterName: PropTypes.string.isRequired,
  practitioners: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  updateFilter: PropTypes.func.isRequired,
  practitionerCount: PropTypes.number.isRequired,
};
