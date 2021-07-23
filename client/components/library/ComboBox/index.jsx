/* eslint-disable react/prop-types */
import React from 'react';
import SelectComponent from 'react-select';
import Icon from '../Icon';
import './styles.scss';

const ComboBox = ({ options, ...rest }) => (
  <SelectComponent
    options={options}
    classNamePrefix="cru-combo-box"
    {...rest}
    className="cru-combo-box"
    components={{
      DropdownIndicator: ({ selectProps }) => (
        <Icon
          type="solid"
          icon={selectProps.menuIsOpen ? 'caret-up' : 'caret-down'}
          className="cru-combo-box__dropdown-indicator"
        />
      ),
    }}
  />
);

export default ComboBox;
