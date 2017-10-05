import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function ShowDetails(props) {
  const {
    url,
    listingData,
  } = props;

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
      {matchKeys.map((mk, index) => {
        let colorStyle = {};
        let displayData = data[mk]

        /*if (mk === 'website') {
          displayData = (
            <a
              href={data[mk]}
              target="_blank"
              className={styles.showDetails_website}
            >
              {data[mk]}
            </a>
          );
        }*/

        if (!matches[mk] && mk !== 'country' && mk !== 'website') {
          colorStyle = {
            color: '#FF715A',
          };
        }

        return (
          <div className={styles.showDetails_info} key={index}>
            <div className={styles.showDetails_text} style={colorStyle}>
              {displayData}
            </div>
          </div>
        );
      })}
      <div className={styles.showDetails_links}>
        <a
          href={url}
          target="_blank"
          className={styles.showDetails_view}
        >
          view
        </a>
      </div>
    </div>
  );
}

ShowDetails.propTypes = {
  listingData: PropTypes.object,
}
