import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReportParametersForm from '../ReportParametersForm';
import styles from './tabStyles.scss';

const Index = (props) => (
  <div className={styles.card}>
    <ReportParametersForm {...props} />
  </div>
);

Index.propTypes = { timezone: PropTypes.string };
Index.defaultProps = { timezone: '' };

const mapStateToProps = ({ auth, entities }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  return {
    timezone: activeAccount.get('timezone'),
  };
};

export default connect(mapStateToProps)(Index);
