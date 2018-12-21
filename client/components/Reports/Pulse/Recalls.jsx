
import React from 'react';
import PropTypes from 'prop-types';
import ModeReport from '../../ModeReport';
import Parameters from '../Parameters';
import DropdownSelect from '../../library/DropdownSelect';
import { groupBy } from './utils';
import styles from '../styles.scss';

const REPORT_ID = 'e11a00158d85';

class Recalls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: null,
      start_date: null,
      end_date: null,
      group_by: groupBy[0].value,
      filled: false,
    };
  }

  render() {
    return (
      <div className={styles.page}>
        <Parameters
          render={() => (
            <RecallsFields
              fields={{ group_by: this.state.group_by }}
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
              group_by: this.state.group_by,
              end_date: this.state.end_date,
            }}
          />
        )}
      </div>
    );
  }
}

export default Recalls;

const RecallsFields = ({ fields, onChange }) => (
  <DropdownSelect
    label="Group By"
    className={styles.dropdown}
    options={groupBy}
    value={fields.group_by}
    onChange={value => onChange({ group_by: value })}
  />
);

RecallsFields.propTypes = {
  fields: PropTypes.shape({ group_by: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired,
};
