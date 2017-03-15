
import React, { PropTypes } from 'react';
import { Card, Guage, PieChart, DoughnutChart, LineChart } from '../library';

export default function GuageTest() {
  return (
    <Card>
      <Guage
        percentage={75}
      />
      <PieChart
        displayTooltips={true}
        data={[
          { value: 10, color: 'green', label: 'Facebook' },
          { value: 20, color: 'red', label: 'Twitter' },
          { value: 30, color: 'blue', label: 'LinkedIn' },
        ]}
      />
      <DoughnutChart
        displayTooltips={true}
        data={[
          { value: 10, color: 'green', label: 'Facebook' },
          { value: 20, color: 'red', label: 'Twitter' },
          { value: 30, color: 'blue', label: 'LinkedIn' },
        ]}
      />
      <LineChart
        displayTooltips={true}
        labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
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
    </Card>
  );
}

Guage.propTypes = {

};
