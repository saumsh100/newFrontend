
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Guage, PieChart, LineChart, BarChart } from '../library';

export default function GuageTest() {
  return (
    <Card>
      <Guage percentage={75} />
      <PieChart
        displayTooltips
        data={[
          { value: 10, color: 'green', label: 'Facebook' },
          { value: 20, color: 'red', label: 'Twitter' },
          { value: 30, color: 'blue', label: 'LinkedIn' },
        ]}
      />
      <PieChart
        type="doughnut"
        displayTooltips
        data={[
          { value: 10, color: 'green', label: 'Facebook' },
          { value: 20, color: 'red', label: 'Twitter' },
          { value: 30, color: 'blue', label: 'LinkedIn' },
        ]}
      />
      <LineChart
        displayTooltips
        labels={[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ]}
        dataSets={[
          {
            label: 'Appointments Booked',
            color: 'yellow',
            data: [65, 59, 80, 81, 56, 55, 40],
          },
          {
            label: 'Appointments Cancelled',
            color: 'red',
            data: [10, 12, 13, 3, 2, 1, 0],
          },
        ]}
      />
      <BarChart
        displayTooltips
        labels={['January', 'February', 'March', 'April']}
        dataSets={[
          {
            label: 'Appointments Booked',
            color: ['yellow', 'red', 'green', 'blue'],
            data: [65, 59, 80, 81],
          },
        ]}
      />
      <BarChart
        type="horizontal"
        displayTooltips
        labels={['January', 'February', 'March', 'April']}
        dataSets={[
          {
            label: 'Appointments Booked',
            color: ['yellow', 'red', 'green', 'blue'],
            data: [65, 59, 80, 81],
          },
        ]}
      />
    </Card>
  );
}

Guage.propTypes = {};
