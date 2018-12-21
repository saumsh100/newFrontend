
import React from 'react';
import PropTypes from 'prop-types';
import ModeReport from '../../ModeReport';
import Parameters from '../Parameters';
import DropdownSelect from '../../library/DropdownSelect';
import { groupBy } from './utils';
import styles from '../styles.scss';

const REPORT_ID = 'db339ad9e4ff';

class Reminders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: null,
      start_date: null,
      end_date: null,
      GroupBy: groupBy[0].value,
      filled: false,
    };
  }

  render() {
    return (
      <div className={styles.page}>
        <Parameters
          render={() => (
            <RemindersFields
              fields={{ GroupBy: this.state.GroupBy }}
              onChange={value => this.setState(value)}
            />
          )}
          handleClick={state =>
            this.setState({
              ...state,
              filled: true,
            })
          }
        />
        {this.state.filled && (
          <ModeReport
            reportId={REPORT_ID}
            parameters={{
              Account_name: this.state.account_name,
              start_date: this.state.start_date,
              GroupBy: this.state.GroupBy,
              end_date: this.state.end_date,
            }}
          />
        )}
      </div>
    );
  }
}

export default Reminders;

const RemindersFields = ({ fields, onChange }) => (
  <div>
    <DropdownSelect
      label="Group By"
      className={styles.dropdown}
      options={groupBy}
      value={fields.GroupBy}
      onChange={value => onChange({ GroupBy: value })}
    />
  </div>
);

RemindersFields.propTypes = {
  fields: PropTypes.shape({ GroupBy: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired,
};
