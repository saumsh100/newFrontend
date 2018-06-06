
import React from 'react';
import PropTypes from 'prop-types';
import PatientInfo from './PatientInfo';
import InsightList from './InsightList';
import styles from '../styles.scss';
import { SortByStartDate } from '../../../library/util/SortEntities';

export default function Insights(props) {
  const { insights, patients, appointments } = props;

  const sortedInsights = insights
    .filter(
      insightData =>
        patients.get(insightData.patientId) &&
        insightData.insights &&
        insightData.insights.length > 0
    )
    .sort((a, b) => {
      const app1 = appointments.get(a.appointmentId);
      const app2 = appointments.get(b.appointmentId);
      return SortByStartDate(app1, app2);
    });

  const displayInsights = sortedInsights.map(insightData => (
    <div className={styles.wrapper}>
      <PatientInfo
        insightData={insightData.insights}
        patient={patients.get(insightData.patientId)}
        appointment={appointments.get(insightData.appointmentId)}
        scrollId={scrollId}
      />
      <div className={styles.insightsContainer}>
        <InsightList
          patient={patients.get(insightData.patientId)}
          appointment={appointments.get(insightData.appointmentId)}
          insightData={insightData}
        />
      </div>
    </div>
  ));

  const scrollId = 'insightScrollDiv';

  return (
    <div className={styles.body} id={scrollId}>
      {displayInsights}
    </div>
  );
}

Insights.propTypes = {
  insights: PropTypes.instanceOf(Array),
  appointments: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
};
