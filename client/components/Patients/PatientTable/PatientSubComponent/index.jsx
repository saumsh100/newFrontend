import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Event, Grid, Row, Col } from '../../../library';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import DataTable from './DataTable';
import EventsTable from './EventsTable';
import styles from './styles.scss';

class PatientSubComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      patient
    } = this.props;

    const query = {
      limit: 5,
    };

    this.props.fetchEntities({
      key: 'events',
      url: `/api/patients/${patient.id}/events`,
      params: query,
    })
  }

  render() {
    const {
      patient,
      events,
    } = this.props;

    let dataTableSize = 4;
    if (!events || !events.length) {
      dataTableSize = 4;
    }

    return (
      <Grid className={styles.patientSub}>
        <Row className={styles.content}>
          <Col xs={12} sm={12} md={dataTableSize} className={styles.dataTable}>
            <DataTable
              patient={patient}
            />
          </Col>
          <Col xs={12} sm={12} md={8} className={styles.eventsTable}>
            <div className={styles.verticalLine}>&nbsp;</div>
            <EventsTable
              events={events}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}


function mapStateToProps({ entities }, { patient }) {
  const events = entities.getIn(['events', 'models']).toArray().filter((event) => {
    return event.get('patientId') === patient.id;
  });

  return {
    events,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientSubComponent);
