
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';
import EventModel from '../../../../entities/models/Event';
import { Card, InfiniteScroll } from '../../../library';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import EventList from './EventsList';
import styles from './styles.scss';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      loaded: false,
      eventsLength: 0,
    };
    this.loadMoreEvents = this.loadMoreEvents.bind(this);
  }

  loadMoreEvents() {
    const { events } = this.props;

    const query = {
      limit: 5,
      offset: this.state.limit,
    };

    if (events.length !== this.state.eventsLength) {
      this.setState({
        loaded: true,
      });

      this.props
        .fetchEntities({
          key: 'events',
          id: 'getPatientEventsScroll',
          url: `/api/patients/${this.props.patientId}/events`,
          params: query,
        })
        .then(() => {
          this.setState({
            loaded: false,
            limit: this.state.limit + 5,
            eventsLength: events.length,
          });
        });
    } else {
      this.setState({
        loaded: false,
      });
    }
  }

  render() {
    const {
      events, filters, wasPatientFetched, wasEventsFetched,
    } = this.props;

    const style = {
      overflow: 'scroll',
    };

    const wasAllFetched = wasPatientFetched && wasEventsFetched;

    return (
      <Card className={styles.card} runAnimation loaded={!this.state.loaded && wasAllFetched}>
        {wasAllFetched && (
          <div className={styles.eventsContainer} style={style}>
            <InfiniteScroll
              loadMore={this.loadMoreEvents}
              hasMore={
                events.length <= this.state.limit &&
                !this.state.loaded &&
                events.length !== this.state.eventsLength
              }
              initialLoad={false}
              useWindow={false}
              threshold={1}
              className={styles.fill}
            >
              <EventList events={events} filters={filters} />
            </InfiniteScroll>
          </div>
        )}
      </Card>
    );
  }
}

function mapStateToProps({ entities, apiRequests }, { patientId }) {
  const wasEventsFetched = apiRequests.get('getPatientEvents')
    ? apiRequests.get('getPatientEvents').wasFetched
    : null;

  const events = entities
    .getIn(['events', 'models'])
    .toArray()
    .filter(event => event.get('patientId') === patientId);

  return {
    events,
    wasEventsFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
    },
    dispatch,
  );
}

Timeline.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)),
  wasEventsFetched: PropTypes.bool,
  wasPatientFetched: PropTypes.bool,
  patientId: PropTypes.string.isRequired,
  filters: PropTypes.instanceOf(List),
};

Timeline.defaultProps = {
  wasEventsFetched: false,
  wasPatientFetched: false,
  filters: null,
  events: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
