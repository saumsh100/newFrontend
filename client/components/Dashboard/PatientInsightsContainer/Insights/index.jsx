
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import InsightList from './InsightList';
import styles from './styles.scss';
import { SortByStartDate } from '../../../library/util/SortEntities';

export default function Insights(props) {
  const { insights, patients, appointments } = props;

  const sortedInsights = insights
    .filter(insightData => patients.get(insightData.patientId))
    .sort((a, b) => {
      const app1 = appointments.get(a.appointmentId);
      const app2 = appointments.get(b.appointmentId);
      return SortByStartDate(app1, app2);
    });

  const scrollId = 'insightScrollDiv';

  const displayInsights = sortedInsights.map((insightData, index) => {
    const patient = patients.get(insightData.patientId);
    return (
      <InsightList
        key={`patientInsight_${patient.id}`}
        patient={patients.get(insightData.patientId)}
        appointment={appointments.get(insightData.appointmentId)}
        insightData={insightData}
        scrollId={scrollId}
        index={index}
      />
    );
  });

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

Insights.defaultProps = {
  insights: [],
  appointments: Map,
  patients: Map,
};
