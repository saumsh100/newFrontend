import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Event, Loading } from '../../../library';
import { fetchEntitiesRequest, fetchEntities } from '../../../../thunks/fetchEntities';
import EventDateSections from './EventDateSections';
import styles from './styles.scss';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const query = {
      limit: 10,
    };

    this.props.fetchEntitiesRequest({
      key: 'events',
      id: 'getPatientEvents',
      url: `/api/patients/${this.props.patientId}/events`,
      params: query,
    }).then(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  render() {
    const {
      events,
      wasFetched
    } = this.props;

    if (!wasFetched) {
      return <Loading />;
    }

    if (events && events.length === 0) {
      return (<div className={styles.disclaimer}>
        <div className={styles.disclaimer_text}>No Events</div>
      </div>);
    }

    const sortedEvents = events.sort((a, b) => {
      if (moment(b.metaData.createdAt).isBefore(moment(a.metaData.createdAt))) return -1;
      if (moment(b.metaData.createdAt).isAfter(moment(a.metaData.createdAt))) return 1;
      return 0;
    });

    const dateObj = {};

    sortedEvents.forEach((ev) => {
      const meta = ev.get('metaData');
      const key = moment(meta.createdAt).format('MMMM Do YYYY');

      if (dateObj.hasOwnProperty(key)) {
        dateObj[key].push(ev);
      } else {
        dateObj[key] = [ev];
      }
    });

    const dateSections = Object.keys(dateObj);
    return (
      <Card className={styles.card}>
        <div className={styles.eventsContainer}>
          <div className={styles.verticalLine}>&nbsp;</div>
          <div className={styles.eventsList}>
            {dateSections.length ? dateSections.map((date) => {
              return (
                <EventDateSections
                  dateHeader={date}
                  events={dateObj[date]}
                />
              );
            }) : null}
          </div>
        </div>
      </Card>
    );
  }
}

function mapStateToProps({ entities, apiRequests }, { patientId }) {

  const wasFetched = (apiRequests.get('getPatientEvents') ? apiRequests.get('getPatientEvents').wasFetched : null);

  const events = entities.getIn(['events', 'models']).toArray().filter((event) => {
    return event.get('patientId') === patientId;
  });

  return {
    events,
    wasFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
  }, dispatch)
}

const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Timeline);
