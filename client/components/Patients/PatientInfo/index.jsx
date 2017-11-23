
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from '../../library';
import { fetchEntities, fetchEntitiesRequest, updateEntityRequest } from '../../../thunks/fetchEntities';
import EditDisplay from './EditDisplay';
import TopDisplay from './TopDisplay';
import Timeline from './Timeline';
import LeftInfoDisplay from './LeftInfoDisplay';
import styles from './styles.scss';

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      tabIndex: 0,
    };

    this.openModal = this.openModal.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this);
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
    ]);
  }

  openModal() {
    this.setState({
      isOpen: true,
    });
  }

  reinitializeState() {
    this.setState({
      isOpen: false,
    });
  }

  handleTabChange(index) {
    this.setState({
      tabIndex: index,
    });
  }

  render() {
    const patientId = this.props.match.params.patientId;

    const {
      patient,
      patientStats,
      updateEntityRequest,
      wasFetched,
    } = this.props;

    if (!wasFetched || !patient) {
      return <Loader color="#FF715A" />;
    }

    return (
      <Grid className={styles.mainContainer}>
        <Row>
          <Col sm={12} md={12} className={styles.patientDisplay}>
            <TopDisplay
              patient={patient}
              patientStats={patientStats}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className={styles.infoDisplay}>
            <EditDisplay
              patient={patient}
              updateEntityRequest={updateEntityRequest}
              reinitializeState={this.reinitializeState}
              isOpen={this.state.isOpen}
              outerTabIndex={this.state.tabIndex}
            />
            <LeftInfoDisplay
              patient={patient}
              openModal={this.openModal}
              reinitializeState={this.reinitializeState}
              tabIndex={this.state.tabIndex}
              handleTabChange={this.handleTabChange}
            />
          </Col>
          <Col sm={12} md={8} className={styles.timeline}>
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
  match: PropTypes.instanceOf(Object),
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
    updateEntityRequest,
  }, dispatch);
}

function mapStateToProps({ entities, apiRequests }, { match }) {
  const patients = entities.getIn(['patients', 'models']);
  const patientStats = (apiRequests.get('patientIdStats') ? apiRequests.get('patientIdStats').data : null);
  const wasFetched = (apiRequests.get('patientIdStats') ? apiRequests.get('patientIdStats').wasFetched : null);

  return {
    patient: patients.get(match.params.patientId),
    patientStats,
    wasFetched,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientInfo);
