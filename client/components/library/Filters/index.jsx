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
          let content =
          f.items.map(i => {
            return i.type === 'checkbox' ?
              <div className={styles.filters__checkFilter__chbox}>
                <span>{i.value}</span>
                <span><Checkbox /></span>
              </div>
              :
              <div className={styles.filters__selectFilter}>
                <select>
                  <option selected value={i.options[0]}>{i.options[0]}</option>
                    {i.options.map(item => (
                    <option value={item}>{item}</option>
                    ))} 
                </select>
              </div>
          })

          return (
            <div>
              <div className={styles.filters__title}>{f.title}</div>
              <div className={styles.filters__checkFilter}>
                {content}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  );
}