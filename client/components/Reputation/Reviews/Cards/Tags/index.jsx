import React, { Component, PropTypes } from 'react';
import { Card, Tag } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function Tags() {
  return (
    <Card >
      <div className={styles.tags}>
        <div className={styles.tags__left}>
          <Tag label="dentist" color={colorMap.blue}  />
          <Tag label="dentist vancouver" color={colorMap.red} />
          <Tag label="dentist kitsilano" color={colorMap.yellow} />
          <Tag label="dentist hygienist" color={colorMap.green} />
          <span className={styles.tags__left__update}>Update keyword based on filters</span>
        </div>
      </div>
    </Card>
  )
}
