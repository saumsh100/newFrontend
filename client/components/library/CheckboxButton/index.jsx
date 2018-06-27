
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '../Button';
import styles from './styles.scss';

export default function CheckboxButton(props) {
  const {
    id, label, checked, onChange, value, labelStyles,
  } = props;

  let labelClasses = styles.buttonLabel;

  if (labelStyles) {
    labelClasses = classNames(labelClasses, labelStyles);
  }

  return (
    <div className={styles.checkboxButton} data-test-id={props['data-test-id']}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        value={value}
        onChange={() => {}}
      />
      <Button className={labelClasses} onClick={onChange} onChange={onChange}>
        {label}
      </Button>
    </div>
  );
}

CheckboxButton.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  labelStyles: PropTypes.objectOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  'data-test-id': PropTypes.string,
};

CheckboxButton.defaultProps = {
  id: '',
  value: '',
  checked: false,
  labelStyles: {},
  'data-test-id': '',
};
