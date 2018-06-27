
import React, { PropTypes } from 'react';

function Listings(props) {
  return (
    <div>
      <h1 style={{ display: 'inline' }}>216</h1>
      <span style={{ marginLeft: '20px' }}>Listing score</span>
      <div>
        <span
          style={{ fontSize: '5rem', color: '#28a34e' }}
          className="fa fa-check"
        />
        <div style={{ margin: '20px' }}>
          {props.listingCount} listings found with accurate information
        </div>
      </div>
      <div>
        <span
          style={{ fontSize: '5rem', color: '#ffce56' }}
          className="fa fa-exclamation-triangle"
        />
        <div style={{ margin: '20px' }}>
          {props.errorCount} listings found with possible errors
        </div>
      </div>
      <div>
        <span
          style={{ marginLeft: '5px', fontSize: '5rem', color: '#ff5b5b' }}
          className="fa fa-ban"
        />
        <div style={{ margin: '25px' }}>
          {props.missingCount} sources missing your listing
        </div>
      </div>
    </div>
  );
}

Listings.propTypes = {};

export default Listings;
