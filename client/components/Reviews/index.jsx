
import React, { PropTypes } from 'react';
import { Pie } from 'react-chartjs-2';

function Reviews(props) {
  const rating = props.ratingCounts
  const data = {
    labels: [
      '★★★★★',
      '★★★★',
      '★★★',
      '★★',
      '★',
    ],
    
    datasets: [{
      data: [rating.get('5'), rating.get('4'), rating.get('3'), rating.get('2'), rating.get('1')],
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
