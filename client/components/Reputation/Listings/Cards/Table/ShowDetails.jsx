
import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../library/Link';
import styles from './styles.scss';

export default function ShowDetails(props) {
  const { url, listingData } = props;

  const data = listingData[0].anchorData;
  const matches = listingData[0].anchorDataMatches;

  const organizedKeys = {
    companyName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
  };

  const mergedKeys = Object.assign({}, organizedKeys, matches);
  delete mergedKeys.country;
  const matchKeys = Object.keys(mergedKeys);

  return (
    <div className={styles.showDetails}>
      {matchKeys.map((mk) => {
        let colorStyle = {};
        const displayData = data[mk];

        if (!matches[mk] && mk !== 'country' && mk !== 'website') {
          colorStyle = {
            color: '#FF715A',
          };
        }

        return (
          <div className={styles.showDetails_info} key={mk}>
            <div className={styles.showDetails_text} style={colorStyle}>
              {displayData}
            </div>
          </div>
        );
      })}
      <div className={styles.showDetails_links}>
        <Link to={url} target="_blank" className={styles.showDetails_view}>
          view
        </Link>
      </div>
    </div>
  );
}

ShowDetails.propTypes = {
  listingData: PropTypes.arrayOf(PropTypes.shape({
    anchorData: PropTypes.objectOf(PropTypes.string),
    anchorDataMatches: PropTypes.objectOf(PropTypes.bool),
  })).isRequired,
  url: PropTypes.string.isRequired,
};
