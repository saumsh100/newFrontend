
import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardHeader, BackgroundIcon } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function SocialOverview(props) {
  const {
    title, impressions, engagements, clicks,
  } = props;

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader} title={title} />
      <div className={styles.facebookActivity}>
        <div className={styles.facebookActivity__container}>
          <div className={styles.iconsContainer}>
            <BackgroundIcon icon="eye" color={colorMap.grey} fontSize={8.75} />
            <span className={styles.iconsContainer__first}>{impressions}</span>
            <span className={styles.iconsContainer__last}>Impressions</span>
          </div>
          <div className={styles.iconsContainer}>
            <BackgroundIcon
              icon="heart"
              color={colorMap.facebookBlue}
              fontSize={8.75}
            />
            <span className={styles.iconsContainer__first}>{engagements}</span>
            <span className={styles.iconsContainer__last}>Engagements</span>
          </div>
          <div className={styles.iconsContainer}>
            <BackgroundIcon
              icon="location-arrow"
              color={colorMap.dark}
              fontSize={8.75}
            />
            <span className={styles.iconsContainer__first}>{clicks}</span>
            <span className={styles.iconsContainer__last}>Clicks</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

SocialOverview.propTypes = {
  title: PropTypes.string,
  impressions: PropTypes.string,
  engagements: PropTypes.string,
  clicks: PropTypes.string,
};
