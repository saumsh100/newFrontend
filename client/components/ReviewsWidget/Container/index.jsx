
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Header from '../Header';
import styles from './styles.scss';

function WidgetContainer(props) {
  return (
    <div className={styles.container}>
      <Header />
      {props.children}
    </div>
  );
}

WidgetContainer.propTypes = {};

export default WidgetContainer;
