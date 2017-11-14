import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Event } from '../../../library';
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

    // TODO: remove setState here, and instead the loading bool comes from redux apiRequest
    this.props.fetchEntities({
        key: 'events',
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
    } = this.props;

    if (!events || !events.length) {
      return <div className={styles.disclaimer}>
        <div className={styles.disclaimer_text}>Currently, there are no events for this patient.</div>
      </div>
    }

    const dateObj = {};

    events.forEach((ev) => {
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

function mapStateToProps({ entities }, { patientId }) {
  const events = entities.getIn(['events', 'models']).toArray().filter((event) => {
    return event.get('patientId') === patientId;
  });

  return {
    events,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch)
}

const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Timeline);
