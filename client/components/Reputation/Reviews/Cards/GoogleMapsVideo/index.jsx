import React, { Component, PropTypes } from 'react';
import { Card, CardHeader } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function GoogleMapsVideo(props) {
  return (
    <Card>
      <div className={styles.googleMapsRespond}>
        <div className={styles.googleMapsRespond__video}>
          <iframe
            width="250"
            height="120"
            src="https://www.youtube.com/embed/32vzLgGP0Rg"
          />
        </div>
        <div className={styles.googleMapsRespond__descr}>
          <div> Respond to google maps review </div>
          <div> You can respond from here! Connect your Google My Business
            account to get started
          </div>
        </div>
      </div>
    </Card>
  )
}
