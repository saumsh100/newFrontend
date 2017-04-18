
import React, { PropTypes } from 'react';
import { Field } from '../../library';
import styles from './styles.scss';


function FilterField(props) {
  const {
    item,
  } = props;

  let showFieldComponent = null;

  if (item.type === 'checkbox') {
    showFieldComponent = (
      <div className={styles.filters__checkFilter__chbox} >
        <span>{item.value}</span>
        <Field
          component="Checkbox"
          name={item.value}
        />
      </div>
    );
  } else {
    showFieldComponent = (
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

  return showFieldComponent;
}

FilterField.propTypes = {
  item: PropTypes.object,
};

export default FilterField;
