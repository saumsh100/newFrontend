import React, { Component, PropTypes } from 'react';
import { Card, CardHeader } from '../../../library';
import colorMap from '../../../library/util/colorMap';
import styles from '../styles.scss';

export default function VisitorConversions(props) {
  const {
    conversionrate,
    visits,
    appointments,
  } = props;

  return (
    <Card borderColor={colorMap.green}>
      <CardHeader className={styles.cardHeader} title={'Website Visitor Conversions'} />
      <div className={styles.websiteVisitorConversions__mainContainer}>
        <div className={styles.websiteVisitorConversions__rowContainer}>
          <div className={styles.websiteVisitorConversions__conversionCount} >
            <span className={styles.websiteVisitorConversions__row1}>{conversionrate}%</span>
            <span className={styles.websiteVisitorConversions__row2} >Conversions Rate</span>
          </div>
        </div>
        <div className={styles.websiteVisitorConversions__containerBottom}>
          <div className={styles.websiteVisitorConversions__stats} >
            <span>{visits}</span>
            <span>Visits</span>
          </div>
          <div className={styles.websiteVisitorConversions__stats} >
            <span>{appointments}</span>
            <span>Appoinments</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

VisitorConversions.propTypes = {
  conversionrate: PropTypes.number,
  visits: PropTypes.number,
  appointments: PropTypes.number,
};
