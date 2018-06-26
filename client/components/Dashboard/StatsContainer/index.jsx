
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import StatCards from './StatCards';
import styles from './styles.scss';
import { FilterAppointments } from '../Shared/filters';
import withFeatureFlag from '../../../hocs/withFeatureFlag';
import StatsContainerFlagged from '../StatsContainerFlagged';

class StatsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.statCardsContainer}>
          <StatCards
            requests={this.props.requests}
            appointments={this.props.appointments}
            insightCount={this.props.insightCount}
          />
        </div>
      </div>
    );
  }
}

StatsContainer.propTypes = {
  requests: PropTypes.object,
  appointments: PropTypes.object,
  insightCount: PropTypes.number,
};

function mapStateToProps({ dashboard, entities }, { dashboardDate }) {
  const appointments = entities.getIn(['appointments', 'models']);
  const requests = entities.getIn(['requests', 'models']);

  const filteredAppointments = FilterAppointments(
    appointments,
    moment(dashboardDate),
  );

  const filteredRequests = requests.filter(req => !req.get('isCancelled') && !req.get('isConfirmed'));

  return {
    requests: filteredRequests,
    appointments: filteredAppointments,
    insightCount: dashboard.toJS().insightCount,
  };
}

const enhance = connect(
  mapStateToProps,
  null,
);

export default withFeatureFlag(StatsContainerFlagged, 'feature-revenue-card')(enhance(StatsContainer));
