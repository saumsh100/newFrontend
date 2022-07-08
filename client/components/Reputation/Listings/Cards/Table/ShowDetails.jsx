import React from 'react';
import PropTypes from 'prop-types';
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
        const displayData = data[mk];

        return (
          <div className={styles.showDetails_info} key={mk}>
            <div
              className={
                mk === 'city' || mk === 'phone'
                  ? styles.showDetails_detailStyle
                  : styles.showDetails_text
              }
            >
              {displayData}
            </div>
          </div>
        );
      })}
      <div className={styles.showDetails_links}>
        <a href={url} rel="noopener noreferrer" target="_blank" className={styles.showDetails_view}>
          view
        </a>
      </div>
    </div>
  );
}

ShowDetails.propTypes = {
  listingData: PropTypes.arrayOf(
    PropTypes.shape({
      anchorData: PropTypes.objectOf(PropTypes.string),
      anchorDataMatches: PropTypes.objectOf(PropTypes.bool),
    }),
  ).isRequired,
  url: PropTypes.string.isRequired,
};
