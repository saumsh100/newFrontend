
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';
import EventModel from '../../../../entities/models/Event';
import { Card, InfiniteScroll } from '../../../library';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { getEventsOffsetLimitObj } from '../../Shared/helpers';
import EventList from './EventsList';
import styles from './styles.scss';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      eventsLength: 0,
    };
    this.loadMoreEvents = this.loadMoreEvents.bind(this);
  }

  loadMoreEvents() {
    const { events } = this.props;

    const eventsOffsetLimitObj = getEventsOffsetLimitObj();

    /**
     * This function iterates over all events for this patient and counts how many
     * of each type of event there is. Doubling the count
     * if it is a grouped event like Reminder(sms and email)
     */

    events.forEach((ev) => {
      if (ev.type in eventsOffsetLimitObj) {
        eventsOffsetLimitObj[ev.type].offset += !ev.metaData.grouped ? 1 : 2;
      }
    });

    const query = {
      limit: 5,
      eventsOffsetLimitObj,
    };

    this.setState({ loaded: true }, () => {
      this.props
        .fetchEntities({
          key: 'patientTimelineEvents',
          id: 'getPatientEventsScroll',
          url: `/api/patients/${this.props.patientId}/events`,
          params: query,
        })
        .then(() => {
          this.setState({
            loaded: false,
            eventsLength: events.length,
          });
        });
    });
  }

  render() {
    const { events, filters, wasPatientFetched, wasEventsFetched, patient } = this.props;

    const style = { overflow: 'scroll' };

    const wasAllFetched = wasPatientFetched && wasEventsFetched;
    const hasMore = events.length > this.state.eventsLength && !this.state.loaded;

    return (
      <Card className={styles.card} runAnimation loaded={wasAllFetched && !this.state.loaded}>
        {wasAllFetched && (
          <div className={styles.eventsContainer} style={style}>
            <InfiniteScroll
              loadMore={this.loadMoreEvents}
              hasMore={hasMore}
              initialLoad={false}
              useWindow={false}
              threshold={1}
              className={styles.fill}
            >
              <EventList events={events} filters={filters} patient={patient} />
            </InfiniteScroll>
          </div>
        )}
      </Card>
    );
  }
}

function mapStateToProps({ entities, apiRequests }, { patientId }) {
  const wasEventsFetched =
    apiRequests.get('getPatientEvents') && apiRequests.get('getPatientEvents').get('wasFetched');

  const events = entities
    .getIn(['patientTimelineEvents', 'models'])
    .filter(event => event.get('patientId') === patientId)
    .toArray();

  return {
    events,
    wasEventsFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntities }, dispatch);
}

Timeline.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)),
  wasEventsFetched: PropTypes.bool,
  wasPatientFetched: PropTypes.bool,
  patient: PropTypes.shape({}),
  patientId: PropTypes.string.isRequired,
  filters: PropTypes.instanceOf(List),
};

Timeline.defaultProps = {
  patient: null,
  wasEventsFetched: false,
  wasPatientFetched: false,
  filters: null,
  events: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timeline);
