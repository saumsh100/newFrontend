import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import styles from './styles.scss';

const PageHeading = () => <div className={classNames(styles.pageHeading)} />;

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(undefined, mapDispatchToProps)(PageHeading);
