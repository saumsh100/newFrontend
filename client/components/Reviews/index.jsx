
import React, { PropTypes } from 'react';
import { Pie } from 'react-chartjs-2';

function Reviews(props) {
  const data = {
    labels: [
      'Positive',
      'Neutral',
      'Negative',
      'No Rating',
    ],
    
    datasets: [{
      data: [6, 0, 1, 0],
      backgroundColor: [
        '#28a34e',
        '#ffce56',
        '#ff5b5b',
        'lightgrey',
      ],
      
      hoverBackgroundColor: [
        '#28a34e',
        '#ffce56',
        '#ff5b5b',
        'lightgrey',
      ],
    }],
  };
  
  return (
    <div>
      <Pie data={data} />
    </div>
  );
}

Reviews.propTypes = {};

export default Reviews;
