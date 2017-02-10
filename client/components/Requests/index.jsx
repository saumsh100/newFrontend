
import React, { Component, PropTypes } from 'react';
import RequestList from './RequestList';
import { Card} from '../library';
import styles from './style.scss';

class Requests extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { requests, patients, services } = this.props;

    return (
        <Card className={styles.requestBox}>
          <RequestList requests={requests} patients={patients} services={services}/>
        </Card>
    );
  }
}

Request.propTypes = {};

export default Requests;
