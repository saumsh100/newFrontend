
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VCard, DropdownSelect, LineChart } from '../../library';
import styles from './table.scss';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'activePatients',
    };
  }

  render() {
    const data = {};
    const labels = [];
    const values = [];
    Object.keys(this.props.clinics).forEach((clinicKey) => {
      this.props.clinics[clinicKey][this.state.selected].month.forEach((month) => {
        data[month.date] = data[month.date] || parseInt(month.number, 10);
      });
    });

    Object.keys(data).forEach((key) => {
      labels.push(key);
      values.push(data[key]);
    });

    return (
      <VCard noPadding>
        <DropdownSelect
          className={styles.dropdown}
          align="left"
          options={[
            { label: 'Total Active Patients',
value: 'activePatients' },
            { label: 'Total Hygiene Patients',
value: 'hygienePatients' },
            { label: 'Total New Patients',
value: 'newPatients' },
          ]}
          name="city"
          value={this.state.selected}
          required
          onChange={(graph) => {
            this.setState({
              ...this.state,
              selected: graph,
            });
          }}
        />
        <LineChart
          labels={labels}
          dataSets={[
            {
              label: 'asd',
              color: 'blue',
              data: values,
            },
          ]}
        />
      </VCard>
    );
  }
}

Graph.propTypes = {
  clinics: PropTypes.shape({
    name: PropTypes.string,
    newPatients: PropTypes.number,
    activePatients: PropTypes.number,
    hygienePatients: PropTypes.number,
  }),
  totals: PropTypes.shape({
    totalNewPatients: PropTypes.number,
    totalActivePatients: PropTypes.number,
    totalHygienePatients: PropTypes.number,
  }),
};

export default Graph;
