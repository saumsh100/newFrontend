
import React from 'react';
import PropTypes from 'prop-types';
import ModeReport from '../../ModeReport';
import Parameters from '../Parameters';
import { Tooltip, DropdownSelect, Toggle } from '../../library';
import { groupBy } from './utils';
import styles from '../styles.scss';

const REPORT_ID = '5b166cb90d50';

class TotalProduction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: null,
      start_date: null,
      end_date: null,
      GroupBy: groupBy[0].value,
      compare: 0,
      filled: false,
    };
  }

  render() {
    return (
      <div className={styles.page}>
        <Parameters
          render={() => (
            <TotalProductionFields
              fields={{
                GroupBy: this.state.GroupBy,
                compare: this.state.compare,
              }}
              onChange={value =>
                this.setState({
                  ...value,
                  filled: false,
                })
              }
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
              compare: this.state.compare,
            }}
          />
        )}
      </div>
    );
  }
}

export default TotalProduction;

const TotalProductionFields = ({ fields, onChange }) => (
  <div className={styles.fieldsWrapper}>
    <DropdownSelect
      label="Group By"
      className={styles.dropdown}
      options={groupBy}
      value={fields.GroupBy}
      onChange={value => onChange({ GroupBy: value })}
    />
    <Tooltip
      placement="top"
      trigger={['hover', 'click']}
      overlay={
        <span>
          If enabled, past production is displayed next to each data point, for easy comparison.{' '}
          <br /> <br />
          For example, if grouping by month, the production of the previous month will be displayed.{' '}
          <br />
          Alternatively, if grouping by year, the production of the previous year will be displayed.
        </span>
      }
    >
      <Toggle
        className={styles.toggleWrapper}
        label="Display Comparisons"
        checked={+fields.compare}
        onChange={({ target: { checked } }) => onChange({ compare: +checked })}
      />
    </Tooltip>
  </div>
);

TotalProductionFields.propTypes = {
  fields: PropTypes.shape({ GroupBy: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired,
};
