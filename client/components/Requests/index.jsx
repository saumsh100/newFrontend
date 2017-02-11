
import React, { Component, PropTypes } from 'react';
import RequestList from './RequestList';
import { Card, CardHeader } from '../library';
import styles from './style.scss';

class Requests extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { requests, patients, services } = this.props;
    return (
      <Card className={styles.requestCard}>
        <CardHeader count={requests.size} title={'New Appointment Requests'}/>
        <RequestList requests={requests} patients={patients} services={services}/>
      </Card>
    );
  }
}

Request.propTypes = {};

export default Requests;
