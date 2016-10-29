
import React, { PropTypes } from 'react';

function Listings(props) {
  return (
    <div>
      <h1 style={{ display: 'inline' }}>216</h1><span style={{ marginLeft: '20px' }}>Listing score</span>
      <div>
        <span style={{ fontSize: '5rem', color: '#28a34e' }} className="fa fa-check"></span>
        <div style={{ margin: '20px' }}>
          2 listings found with accurate information
        </div>
      </div>
      <div>
        <span style={{ fontSize: '5rem', color: '#ffce56' }} className="fa fa-exclamation-triangle"></span>
        <div style={{ margin: '20px' }}>
          3 listings found with possible errors
        </div>
      </div>
      <div>
        <span style={{ marginLeft: '5px', fontSize: '5rem', color: '#ff5b5b', }} className="fa fa-ban"></span>
        <div style={{ margin: '25px' }}>
          15 sources missing your listing
        </div>
      </div>
    </div>
  );
}

Listings.propTypes = {};

export default Listings;
