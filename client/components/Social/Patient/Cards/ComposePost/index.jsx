import React, { Component } from 'react';
import { Card, CardHeader } from '../../../../library';
import styles from './styles.scss';

class ComposePost extends Component {
  render() {
    return (
      <Card className={styles.post}>
        <CardHeader title="Compose a Post" />
      </Card>
    );
  }
}

export default ComposePost;

