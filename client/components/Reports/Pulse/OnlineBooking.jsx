
import React from 'react';
import PropTypes from 'prop-types';
import ModeReport from '../../ModeReport';
import Parameters from '../Parameters';
import DropdownSelect from '../../library/DropdownSelect';
import { categories, groupBy } from './utils';
import styles from '../styles.scss';

const REPORT_ID = '9992a4865dd0';

class OnlineBooking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: null,
      start_date: null,
      end_date: null,
      category: categories[0].value,
      group_by: groupBy[0].value,
      filled: false,
    };
  }

  render() {
    return (
      <div className={styles.page}>
        <Parameters
          render={() => (
            <OnlineBookingFields
              fields={{
                category: this.state.category,
                group_by: this.state.group_by,
              }}
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
              category: this.state.category,
              group_by: this.state.group_by,
              end_date: this.state.end_date,
            }}
          />
        )}
      </div>
    );
  }
}

export default OnlineBooking;

const OnlineBookingFields = ({ fields, onChange }) => (
  <div>
    <DropdownSelect
      className={styles.dropdown}
      options={categories}
      value={fields.category}
      label="Category"
      onChange={value => onChange({ category: value })}
    />
    <DropdownSelect
      label="Group By"
      className={styles.dropdown}
      options={groupBy}
      value={fields.group_by}
      onChange={value => onChange({ group_by: value })}
    />
  </div>
);

OnlineBookingFields.propTypes = {
  fields: PropTypes.shape({
    category: PropTypes.string,
    group_by: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
