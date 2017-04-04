import React, { PropTypes } from 'react';
import { Card, Checkbox } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function Filters(props) {
  return (
    <Card borderColor={colorMap.red} className={styles.card}>
      <div className={styles.filters}>
        <div className={styles.filters__header}>
          <div className={styles.filters__header__left}>
            <span>Filters</span>
            <span className="fa fa-sliders" />
          </div>
          <div className={styles.filters__header__right}>
            <span>Select All</span>
            <span>Clear All</span>
          </div>
        </div>
        <div className={styles.filters__search}>
          <span className="fa fa-search" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className={styles.filters__title}>Date Range</div>
        <div className={styles.filters__selectFilter}>
          <select>
            <option selected value="option1">Select date range</option>
            <option value="option2">option1</option>
            <option value="option3">option2</option>
            <option value="option4">option3</option>
            <option value="option5">option4</option>
          </select>
        </div>
        <div className={styles.filters__title}>Sources</div>
        <div className={styles.filters__checkFilter}>
          <div className={styles.filters__checkFilter__chbox}>
            <span>Google maps (5)</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>Yelp (3)</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>Facebook (3)</span>
            <span><Checkbox /></span>
          </div>
        </div>
        <div className={styles.filters__title}>Rating</div>
        <div className={styles.filters__checkFilter}>
          <div className={styles.filters__checkFilter__chbox}>
            <span>1 Star</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>2 Star</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>3 Star</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>4 Star</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>5 Star</span>
            <span><Checkbox /></span>
          </div>
          <div className={styles.filters__checkFilter__chbox}>
            <span>No Rating</span>
            <span><Checkbox /></span>
          </div>
        </div>
      </div>
    </Card>
  );
}
