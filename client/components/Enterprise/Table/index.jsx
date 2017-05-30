import React from 'react';
import { VCard } from '../../library';
import styles from './table.scss';

const EnterpriseTable = () =>
  <VCard noPadding>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th} style={{ width: '100%' }}>
            <h2 className={styles['th-title']}>Clinics</h2>
            <p className={styles['th-total']}>10</p>
          </th>
          <th className={styles.th}>
            <h2 className={styles['th-title']}>Active Patients</h2>
            <p className={styles['th-total']}>73657</p>
            <i className={`fa fa-users ${styles['th-icon']}`} aria-hidden="true" />
          </th>
          <th className={styles.th}>
            <h2 className={styles['th-title']}>Patients with Hygiene Apps</h2>
            <p className={styles['th-total']}>24885</p>
            <i className={`fa fa-tablet ${styles['th-icon']}`} aria-hidden="true" />
          </th>
          <th className={styles.th}>
            <h2 className={styles['th-title']}>New Patients</h2>
            <p className={styles['th-total']}>930</p>
            <i className={`fa fa-users ${styles['th-icon']}`} aria-hidden="true" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr className={styles.tr}>
          <td className={styles.td}>
            <div className={styles['title-container']}>
              <span className={styles['order-number-title']}>#</span>
            </div>
            <div className={styles['col-content']}>
              <span className={styles['order-number']}>1</span>
              <strong className={styles['row-title']}>Olympic Village Dental</strong>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['title-container']}>
              <span className={styles['col-title']}>Total Active Patients</span>
              <span className={styles['col-title']}>CDI</span>
            </div>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['title-container']}>
              <span className={styles['col-title']}>Total Hygiene Apps</span>
              <span className={styles['col-title']}>CDI</span>
            </div>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['title-container']}>
              <span className={styles['col-title']}>Total New Patients</span>
              <span className={styles['col-title']}>CDI</span>
            </div>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
        </tr>
        <tr className={styles.tr}>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span className={styles['order-number']}>2</span>
              <strong className={styles['row-title']}>Olympic Village Dental</strong>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
        </tr>
        <tr className={styles.tr}>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span className={styles['order-number']}>3</span>
              <strong className={styles['row-title']}>Olympic Village Dental</strong>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
          <td className={styles.td}>
            <div className={styles['col-content']}>
              <span>img</span>
              <span className={styles['col-numbers']}>8939</span>
              <span className={styles['col-numbers']}>97%</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </VCard>
;

export default EnterpriseTable;
