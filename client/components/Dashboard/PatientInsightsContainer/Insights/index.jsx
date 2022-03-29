import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import InsightList from './InsightList';
import styles from '../../styles';
import { SortByStartDate } from '../../../library/util/SortEntities';

export default function Insights(props) {
  const { insights, patients, appointments, timezone } = props;

  const sortedInsights = insights
    .toJS()
    .filter(
      (insightData) =>
        patients.get(insightData.patientId) && appointments.get(insightData.appointmentId),
    )
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
        timezone={timezone}
        index={index}
      />
    );
  });

  return (
    <div className={styles.insights_body} id={scrollId}>
      {displayInsights}
    </div>
  );
}

Insights.propTypes = {
  insights: PropTypes.instanceOf(Array),
  appointments: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  timezone: PropTypes.string.isRequired,
};

Insights.defaultProps = {
  insights: [],
  appointments: Map,
  patients: Map,
};
