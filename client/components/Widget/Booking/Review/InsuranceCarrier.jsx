
import React from 'react';
import PropTypes from 'prop-types';
import data from './insurance_carriers';
import { Input, Icon } from '../../../library';
import DropdownSuggestion from '../../../library/DropdownSuggestion/index';
import styles from './styles.scss';

const formatInsurance = label => data.find(opt => opt.label === label).value;

export default function InsuranceCarrier(props) {
  const iconClasses = props.error ? styles.errorIcon : null;
  return props.isCustomCarrier ? (
    <Input
      required
      type="text"
      name="insuranceCarrier"
      theme={{ group: styles.inputInsurance, error: styles.inputError }}
      error={props.error}
      placeholder="Your insurance carrier's name"
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      iconComponent={
        <button className={styles.toggleInput} onClick={() => props.onChange('insurance_1')}>
          <Icon icon="times" type="light" className={iconClasses} />
        </button>
      }
    />
  ) : (
    <DropdownSuggestion
      required
      options={data}
      data-test-id="text"
      name="insuranceCarrier"
      value={formatInsurance(props.value)}
      onChange={props.onChange}
      renderValue={value => data.find(opt => opt.value === value).label}
      theme={{
        slotButton: styles.reviewAndBookSlot,
        wrapper: styles.reviewAndBookInputWrapper,
      }}
    />
  );
}

InsuranceCarrier.propTypes = {
  error: PropTypes.string,
  isCustomCarrier: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
