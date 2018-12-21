
import React from 'react';
import PropTypes from 'prop-types';
import DropdownSelect from '../library/DropdownSelect';
import { Button, Icon, Input } from '../library';
import DayPickerRange from '../library/DayPicker/DayPickerRange';
import styles from './styles.scss';

const options = [
  {
    label: 'Acu Dental & Orthodontics',
    value: '41ed3497-fb86-4d0c-94bf-a2db0912ed0a',
  },
  {
    label: 'Highgate Medical Dental Clinic',
    value: 'a25cdce2-d696-43c8-bde7-fe3c1ccc945e',
  },
  {
    label: 'Maple Place Dental Centre',
    value: 'b42d291f-9d1e-4605-a169-2bade2a90405',
  },
  {
    label: 'Mega Dental Group',
    value: '2de09e55-0f97-4129-af20-8ae2e9de46a0',
  },
  {
    label: 'Willow Dental Clinic Langley',
    value: '4fc34155-d4c2-4177-8d1c-32a78790b590',
  },
];

const inputsAndNavigation = ({
  from: { fromReadOnly, fromValue, fromRef, fromOnClick },
  to: { toReadOnly, toValue, toRef, toOnClick },
}) => (
  <div className={styles.rangeInputContainer}>
    <Input
      readOnly={fromReadOnly}
      refCallBack={fromRef}
      label="Start Date"
      value={fromValue}
      onClick={fromOnClick}
    />
    <Icon icon="arrow-right" className={styles.arrowTo} />
    <Input
      readOnly={toReadOnly}
      refCallBack={toRef}
      value={toValue}
      label="End Date"
      onClick={toOnClick}
    />
  </div>
);

inputsAndNavigation.propTypes = {
  from: PropTypes.shape({
    fromReadOnly: PropTypes.bool,
    fromValue: PropTypes.string,
    fromRef: PropTypes.func,
    fromOnClick: PropTypes.func,
  }).isRequired,
  to: PropTypes.shape({
    toReadOnly: PropTypes.bool,
    toValue: PropTypes.string,
    toRef: PropTypes.func,
    toOnClick: PropTypes.func,
  }).isRequired,
};

class Parameters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: options[0].value,
      start_date: null,
      end_date: null,
    };
  }

  render() {
    return (
      <div className={styles.fieldsWrapper}>
        <div className={styles.field}>
          <DayPickerRange
            popover
            fieldsWrapper={inputsAndNavigation}
            disabledDays={{ after: new Date() }}
            from={this.state.start_date}
            to={this.state.end_date}
            onChange={({ from, to }) =>
              this.setState({
                start_date: from && from.toISOString().split('T')[0],
                end_date: to && to.toISOString().split('T')[0],
              })
            }
            monthsToShow={2}
            maxDays={60}
          />
        </div>
        <DropdownSelect
          className={styles.dropdown}
          options={options}
          label="Account Name"
          value={this.state.account_name}
          onChange={accountId => this.setState({ account_name: accountId })}
        />
        {this.props.render && this.props.render()}
        <Button onClick={() => this.props.handleClick(this.state)} className={styles.button}>
          Get Report
        </Button>
      </div>
    );
  }
}

Parameters.propTypes = {
  handleClick: PropTypes.func.isRequired,
  render: PropTypes.func,
};

Parameters.defaultProps = { render: undefined };

export default Parameters;
