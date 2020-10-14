
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, DropdownMenu, Icon, MenuItem } from '../../library';
import styles from './styles.scss';
import { practitionerShape } from '../../library/PropTypeShapes';

export const practitionerFilterOptions = {
  'All Practitioners': {
    label: 'All',
    filter: practitioners => practitioners,
  },
  'Active Practitioners': {
    label: 'Active',
    filter: practitioners => practitioners.filter(practitioner => practitioner.isActive === true),
  },
  'Inactive Practitioners': {
    label: 'Inactive',
    filter: practitioners => practitioners.filter(practitioner => practitioner.isActive === false),
  },
};

export default function PractitionerListFilter(props) {
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
      labelComponent={cb => (
        <Button {...cb} className={styles.labelButton}>
          {props.filterName}
          <Icon icon="caret-down" className={styles.labelButtonIcon} />
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
};
