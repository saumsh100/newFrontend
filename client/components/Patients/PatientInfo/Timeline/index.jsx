import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Event } from '../../../library';
import { fetchEntitiesRequest } from '../../../../thunks/fetchEntities';
import styles from './styles.scss';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'patientIdEvents',
        url: `/api/patients/${this.props.patientId}/events`,
      }),
    ]).then(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  render() {
    const {
      patientEvents,
    } = this.props;

    if (!patientEvents) {
      return (
        <Loader
          loadedClassName={styles.loader}
          top="75%"
          left="65%"
          loaded={this.state.loaded}
          color="#FF715A"
        />
      );
    }
    const eventsData = patientEvents.toJS();

    const dateObj = {};

    eventsData.events.map((ev) => {
      const key = moment(ev.createdAt).format('MMMM Do YYYY');
      if (dateObj.hasOwnProperty(key)) {
        dateObj[key].push(ev);
      } else {
        dateObj[key] = [ev];
      }
    });

    return (
      <Card className={styles.card}>
        <div className={styles.eventsContainer}>
          <div className={styles.verticalLine}>&nbsp;</div>
          <div className={styles.eventsList}>
            <Event
              type="email"
            />
            <Event
              type="review"
            />
            <Event
              type="appointment"
            />
            <Event
              type="email"
            />
            <Event
              type="appointment"
            />
            <Event
              type="message"
            />
            <Event
              type="review"
            />
            <Event
              type="appointment"
            />
            <Event
              type="message"
            />
            <Event
              type="message"
            />
            <Event
              type="review"
            />
          </div>
        </div>
      </Card>
    );
  }
}

function mapStateToProps({ apiRequests }) {
  const patientEvents = (apiRequests.get('patientIdEvents') ? apiRequests.get('patientIdEvents').data : null);

  return {
    patientEvents,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch)
}

const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Timeline);
