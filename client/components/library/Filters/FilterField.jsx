import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '..';
import styles from './styles.scss';

function FilterField(props) {
  const { item, flipped } = props;

  return item.type === 'checkbox' ? (
    <div className={styles.filters__checkFilter__chbox}>
      <Field component="Checkbox" name={item.value} flipped={flipped} />
      <span className={styles.filters__item}>{item.value}</span>
    </div>
  ) : (
    <div className={styles.filters__selectFilter}>
      <Field
        name={item.name}
        label={item.options[0].value}
        component="DropdownSelect"
        options={item.options}
      />
    </div>
  );
}

FilterField.propTypes = {
  item: PropTypes.shape({ value: PropTypes.string, type: PropTypes.string }).isRequired,
  flipped: PropTypes.bool.isRequired,
};

export default FilterField;
