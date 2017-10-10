import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from '../../library';
import { fetchEntities, fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import InfoDisplay from './InfoDisplay';
import TopDisplay from './TopDisplay';
import Timeline from './Timeline';
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
    const patient = this.props.patient;

    if (!patient) {
      return <Loader loaded={this.state.loaded} color="#FF715A" />;
    }

    return (
      <Grid>
        <Row>
          <Col sm={12} md={12} className={styles.patientDisplay}>
            <TopDisplay patientId={patientId} />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className={styles.infoDisplay}>
            <InfoDisplay patientId={patientId} />
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
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

function mapStateToProps({ entities }, { match }) {
  const patients = entities.getIn(['patients', 'models']);
  if (!patients) {
    return null;
  }
  console.log(match.params.patientId)
  return {
    patient: patients.get(match.params.patientId),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientInfo);
