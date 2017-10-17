
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from '../../library';
import { fetchEntities, fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import EditDisplay from './EditDisplay';
import TopDisplay from './TopDisplay';
import Timeline from './Timeline';
import SettingsDisplay from './SettingsDisplay/index';
import DataDisplay from './DataDisplay';
import styles from './styles.scss';

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const patientId = this.props.match.params.patientId;
    const url = `/api/patients/${patientId}`;

    Promise.all([
      this.props.fetchEntities({
        key: 'patients',
        url,
      }),
      this.props.fetchEntitiesRequest({
        id: 'patientIdStats',
        url: `/api/patients/${patientId}/stats`,
      }),
    ]).then(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  render() {
    const patientId = this.props.match.params.patientId;

    const {
      patient,
      patientStats,
    } = this.props;

    if (!patient || !patientStats) {
      return <Loader loaded={this.state.loaded} color="#FF715A" />;
    }

    return (
      <Grid className={styles.mainContainer}>
        <Row>
          <Col sm={12} md={12} className={styles.patientDisplay}>
            {/*<SettingsDisplay patient={patient}/>*/}
            <TopDisplay patient={patient} />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className={styles.infoDisplay}>
            <EditDisplay patient={patient} />
            <DataDisplay
              patient={patient}
            />
          </Col>
          <Col sm={12} md={8} className={styles.timeline}>
            <div className={styles.timeline_header}>
              Timeline and Activities
            </div>
            <Timeline patientId={patientId} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

PatientInfo.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
  }, dispatch);
}

function mapStateToProps({ entities, apiRequests }, { match }) {
  const patients = entities.getIn(['patients', 'models']);
  const patientStats = (apiRequests.get('patientIdStats') ? apiRequests.get('patientIdStats').data : null);

  return {
    patient: patients.get(match.params.patientId),
    patientStats,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientInfo);
