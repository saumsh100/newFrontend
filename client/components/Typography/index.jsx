import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import { Card } from '../library';
export default function Typography(props) {
  return (
    <Card className={styles.mainContainer}>
      <div className={styles.padding}>
        Default font: abcdefg 12345 ABCDEFG
      </div>
      <div className={styles.padding}>
        <span className={styles.mediumFont}> Medium font: abcdefg 12345 ABCDEFG  </span>
      </div>
      <div className={styles.padding}>
        <span className={styles.jumboFont}> Jumbo font: abcdefg 12345 ABCDEFG - Dashboard Stats </span>
      </div>
      <div className={styles.padding}>
        <span className={styles.header}> Header : abcdefg 12345 ABCDEFG - Settings Page </span>
      </div>
      <div className={styles.padding}>
        <span className={styles.cardHeaderCount}> CardHeader Count: 12345 - Dashboard Cards </span>
        <div>
          <span className={styles.cardHeaderTitle}> CardHeader Title: abcdefg 12345 ABCDEFG - Dashboard Cards </span>
        </div>
      </div>
      <div className={styles.padding}>
        <span className={styles.listHeader}> List Header: abcdefg 12345 ABCDEFG - Appointments List  </span>
      </div>
      <div className={styles.padding}>
        <span className={styles.subHeader}> Sub Header: abcdefg 12345 ABCDEFG - Patientlist on Patient Management  </span>
        <div>
          <span className={styles.subHeaderMedium}> Sub Header Medium: abcdefg 12345 ABCDEFG - Patientlist on Patient Management  </span>
        </div>
      </div>
      <div className={styles.padding}>
        <span className={styles.tab}> Tabs: abcdefg 12345 ABCDEFG - Settings Practitioner  </span>
      </div>
    </Card>
  );
}
