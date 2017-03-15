
import React, { PropTypes } from 'react';
import { Card, Guage, PieChart, DoughnutChart } from '../library';

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
    </Card>
  );
}

Guage.propTypes = {

};
