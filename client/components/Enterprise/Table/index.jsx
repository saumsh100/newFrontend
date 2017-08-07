import React from 'react';
import PropTypes from 'prop-types';
import { VCard, TrendLine } from '../../library';
import styles from './table.scss';

function EnterpriseTable(props) {
  return (<VCard noPadding>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th} style={{ width: '100%' }}>
            <h2 className={styles['th-title']}>Clinics</h2>
            <p className={styles['th-total']}>{Object.keys(props.clinics).length}</p>
          </th>
          <th className={styles.th}>
            <h2 className={styles['th-title']}>Active Patients</h2>
            <p className={styles['th-total']}>{props.totals.totalActivePatients}</p>
            <i className={`fa fa-users ${styles['th-icon']}`} aria-hidden="true" />
          </th>
          <th className={styles.th}>
            <h2 className={styles['th-title']}>Patients with Hygiene Apps</h2>
            <p className={styles['th-total']}>{props.totals.totalHygienePatients}</p>
            <i className={`fa fa-tablet ${styles['th-icon']}`} aria-hidden="true" />
          </th>
          <th className={styles.th}>
            <h2 className={styles['th-title']}>New Patients</h2>
            <p className={styles['th-total']}>{props.totals.totalNewPatients}</p>
            <i className={`fa fa-users ${styles['th-icon']}`} aria-hidden="true" />
          </th>
        </tr>
      </thead>

      <tbody>
        {Object.keys(props.clinics).map((id, index) => {
          const clinic = props.clinics[id];
          return (
            <tr className={styles.tr} key={id}>
              <td className={styles.td}>
                <div className={styles['title-container']}>
                  <span className={styles['order-number-title']}>#</span>
                </div>
                <div className={styles['col-content']}>
                  <span className={styles['order-number']}>{index + 1}</span>
                  <strong className={styles['row-title']}>{clinic.name}</strong>
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles['title-container']}>
                  <span className={styles['col-title']}>Total Active Patients</span>
                  <span className={styles['col-title']}>CDI</span>
                </div>
                <div className={styles['col-content']}>
                  <span className={styles['col-numbers']}>
                    <TrendLine
                      width={80}
                      values={clinic.activePatients.month.map(value => parseInt(value.number, 10))}
                    />
                  </span>
                  <span className={styles['col-numbers']}>{clinic.activePatients.total}</span>
                  <span className={styles['col-numbers']}>97%</span>
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles['title-container']}>
                  <span className={styles['col-title']}>Total Hygiene Apps</span>
                  <span className={styles['col-title']}>CDI</span>
                </div>
                <div className={styles['col-content']}>
                  <span className={styles['col-numbers']}>
                    <TrendLine
                      width={80}
                      values={clinic.hygienePatients.month.map(value => parseInt(value.number, 10))}
                    />
                  </span>
                  <span className={styles['col-numbers']}>{clinic.hygienePatients.total}</span>
                  <span className={styles['col-numbers']}>97%</span>
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles['title-container']}>
                  <span className={styles['col-title']}>Total New Patients</span>
                  <span className={styles['col-title']}>CDI</span>
                </div>
                <div className={styles['col-content']}>
                  <span className={styles['col-numbers']}>
                    <TrendLine
                      width={80}
                      values={clinic.newPatients.month.map(value => parseInt(value.number, 10))}
                    />
                  </span>
                  <span className={styles['col-numbers']}>{clinic.newPatients.total}</span>
                  <span className={styles['col-numbers']}>97%</span>
                </div>
              </td>
            </tr>);
        })}
      </tbody>
    </table>
  </VCard>);
}

EnterpriseTable.propTypes = {
  clinics: PropTypes.shape({
    name: PropTypes.string,
    newPatients: PropTypes.number,
    activePatients: PropTypes.number,
    hygienePatients: PropTypes.number,
  }),
  totals: PropTypes.shape({
    totalNewPatients: PropTypes.number,
    totalActivePatients: PropTypes.number,
    totalHygienePatients: PropTypes.number,
  }),
};

export default EnterpriseTable;
