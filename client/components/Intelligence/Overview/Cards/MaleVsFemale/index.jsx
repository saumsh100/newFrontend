import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Card, CardHeader } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function MaleVsFemale(props) {
  const {
    male,
    female,
  } = props;

  return (
    <Card >
      <CardHeader className={styles.cardHeader} title={props.title} />
      <div className={styles.maleVsFamale}>
        <div className={styles.maleVsFamale__menContainer}>
          <div className={styles.maleVsFamale__menContainer__item} >
            <span className={classNames(styles.maleVsFamale__menContainer__item_iconFemale, 'fa fa-female')} />
            <span className={styles.maleVsFamale__menContainer__item_famale}>{female}%</span>
            <span className={styles.maleVsFamale__menContainer__item_smallText} >Female</span>
          </div>
          <div className={styles.maleVsFamale__menContainer__item}>
            <span className={classNames(styles.maleVsFamale__menContainer__item_iconMale, 'fa fa-male')} />
            <span className={styles.maleVsFamale__menContainer__item_man}>{male}%</span>
            <span className={styles.maleVsFamale__menContainer__item_smallText} >Male</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

MaleVsFemale.propTypes = {
  male: PropTypes.number,
  female: PropTypes.number,
};
