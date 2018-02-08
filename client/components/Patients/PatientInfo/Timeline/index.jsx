import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Loading, InfiniteScroll } from '../../../library';
import { fetchEntitiesRequest, fetchEntities } from '../../../../thunks/fetchEntities';
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

  componentDidMount() {
    const query = {
      limit: 10,
    };

    this.props.fetchEntitiesRequest({
      key: 'events',
      id: 'getPatientEvents',
      url: `/api/patients/${this.props.patientId}/events`,
      params: query,
    });
  }

  loadMoreEvents() {
    const {
      events
    } = this.props;

    const query = {
      limit: 5,
      offset: this.state.limit,
    };

    if (events.length !== this.state.eventsLength) {
      this.setState({
        loaded: true,
      });

      this.props.fetchEntities({
        key: 'events',
        id: 'getPatientEventsScroll',
        url: `/api/patients/${this.props.patientId}/events`,
        params: query,
      }).then(() => {
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
      events,
      wasFetched,
      filters,
    } = this.props;

    let style = {
      overflow: 'scroll',
    };

    /*
    if (wasFetched) {
      const filteredEvents = events.filter((event) => {
        return filters.indexOf(event.get('type').toLowerCase()) > -1;
      });

      if (filteredEvents.length < 10) {
        style = {
          overflow: 'hidden',
        };
      }
    }*/

    return (
      <Card className={styles.card} runAnimation loaded={!this.state.loaded && wasFetched}>
        { wasFetched ?
          <div
            className={styles.eventsContainer}
            style={style}
          >
            <InfiniteScroll
              loadMore={this.loadMoreEvents}
              hasMore={events.length <= this.state.limit && !this.state.loaded && events.length !== this.state.eventsLength}
              initialLoad={false}
              useWindow={false}
              threshold={1}
              className={styles.fill}
            >
              <EventList
                events={events}
                filters={filters}
              />
            </InfiniteScroll>
        </div> : null }
      </Card>
    );
  }
}

Timeline.propTypes = {
  fetchEntitiesRequest: PropTypes.func,
  events: PropTypes.arrayOf(Object),
  wasFetched: PropTypes.bool,
  patientId: PropTypes.string,
  filters: PropTypes.instanceOf(Array),
};

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
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Timeline);
