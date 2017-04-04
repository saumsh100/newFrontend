import React, { PropTypes } from 'react';
import { Card, Checkbox } from '../../library';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';

export default function Filters(props) {
  const { filters } = props;
  return (
    <Card borderColor={colorMap.red} className={styles.card}>
      <div className={styles.filters}>
        <div className={styles.filters__header}>
          <div className={styles.filters__header__left}>
            <span>Filters</span>
            <span className="fa fa-sliders"></span>
          </div>
          <div className={styles.filters__header__right}>
            <span>Select All</span>
            <span>Clear All</span>
          </div>
        </div>
        <div className={styles.filters__search}>
          <span className="fa fa-search" ></span>
          <input type="text" placeholder="Search..."/>
        </div>
        {filters.map(f => {
          const content = f.type === 'checkbox' ?
            <div className={styles.filters__checkFilter}>
              {f.items.map(i => (
                <div className={styles.filters__checkFilter__chbox}>
                  <span>{i}</span>
                  <span><Checkbox /></span>
                </div>
              ))}
            </div>
           :
            <div className={styles.filters__selectFilter}>
              <select>
                <option selected value="option1">Select date range</option>
                {f.items.map(i => (
                  <option value={i}>{i}</option>
                ))}
              </select>
            </div>
          return (
            <div>
              <div className={styles.filters__title}>{f.title}</div>
              {content}
            </div>
          )
        })}
      </div>
    </Card>
  );
}