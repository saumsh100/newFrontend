import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import DataSlot from '../../../library/DataSlot';
import ui from '../../../../styles/ui-kit.scss';

const renderList = (props, currentValue, scrollIndex, close, callback) => (
  <div tabIndex={-1} className={ui.dropdown__list} ref={callback}>
    {props.options.map((option, i) => (
      <DataSlot
        key={uuid()}
        theme={{
          slotButton: ui.dropdown__listItem,
          selectedListItem: ui.dropdown__selectedListItem,
        }}
        selected={currentValue === option.value}
        option={option}
        onClick={(e) => {
          e.preventDefault();
          props.onChange(option.value);
          scrollIndex = i;
          close();
        }}
      >
        <span>{option.label}</span>
      </DataSlot>
    ))}
  </div>
);

export default renderList;

renderList.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      labe: PropTypes.string,
    }),
  ).isRequired,
};
