
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, CardHeader } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function VisitorsByDevice(props) {
  const { mobile, tablet, website } = props;

  return (
    <Card>
      <CardHeader className={styles.cardHeader} title="Visitors by device" />
      <div className={styles.visitors}>
        <div className={styles.visitors__container}>
          <div className={styles.visitors__item}>
            <span
              className={classNames(
                styles.visitors__item_mobile,
                'fa fa-mobile-phone',
              )}
            />
            <span className={styles.visitors__item__text}>{mobile}</span>
            <span className={styles.visitors__item__smallText}>Mobile</span>
          </div>
          <div className={styles.visitors__item}>
            <span
              className={classNames(
                styles.visitors__item_tablet,
                'fa fa-tablet',
              )}
            />
            <span className={styles.visitors__item__text}>{tablet}</span>
            <span className={styles.visitors__item__smallText}>Tablet</span>
          </div>
          <div className={styles.visitors__item}>
            <span
              className={classNames(
                styles.visitors__item_computer,
                'fa fa-television',
              )}
            />
            <span className={styles.visitors__item__text}>{website}</span>
            <span className={styles.visitors__item__smallText}>Website</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

VisitorsByDevice.propTypes = {
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  website: PropTypes.number,
};
