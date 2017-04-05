import React, { Component } from 'react';
import { Card, CardHeader, Col, BackgroundIcon } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from './styles.scss';

class ComposePost extends Component {
  render() {
    return (
      <Card className={styles.post}>
        <Col
          xs={12} md={8}
          className={styles.post__left}
        >
          <div className={styles.post__left_header}>
            <div className={styles.header__title}>Compose a Post</div>
            <div className={styles.header}>
              <BackgroundIcon
                icon="plus"
                color={colorMap.blue}
                fontSize={20}
              />
            </div>
          </div>
        </Col>
        <Col
          xs={12} md={4}
          className={styles.post__right}
        >
          <div className={styles.post__rigth_header} />
        </Col>
      </Card>
    );
  }
}

export default ComposePost;

