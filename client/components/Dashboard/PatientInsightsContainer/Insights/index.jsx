
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PatientInfo from './PatientInfo';
import InsightList from './InsightList';
import styles from '../styles.scss';
import { SortByStartDate } from '../../../library/util/SortEntities';

class Insights extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      insights,
      patients,
      appointments,
    } = this.props;

    const sortedInsights = insights.filter((insightData) => {
      return patients.get(insightData.patientId) !== undefined && insightData.insights.length > 0;
    });
      /*.sort((a,b) => {
      const app1 = appointments.get(a.appointmentId);
      const app2 = appointments.get(b.appointmentId);
      return SortByStartDate(app1, app2);
    });*/

    return (
      <div className={styles.body}>
        {sortedInsights.map((insightData) => {
          return (
            <div className={styles.wrapper}>
              <PatientInfo
                patient={patients.get(insightData.patientId)}
              />
              <div className={styles.insightsList}>
                <InsightList
                  patient={patients.get(insightData.patientId)}
                  appointment={appointments.get(insightData.appointmentId)}
                  insightData={insightData}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

Insights.propTypes = {
  insights: PropTypes.instanceOf(Array),
  patients: PropTypes.object,
  appointments: PropTypes.object,
};

export default Insights;
