
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from '../../library';
import ReportParametersForm from '../../ReportParametersForm';
import styles from '../tabStyles.scss';

const PulseV2 = props => (
  <Card className={styles.card}>
    <ReportParametersForm {...props} />
  </Card>
);

PulseV2.propTypes = { timezone: PropTypes.string };
PulseV2.defaultProps = { timezone: '' };

const mapStateToProps = ({ auth, entities }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  return {
    timezone: activeAccount.get('timezone'),
  };
};

export default connect(mapStateToProps)(PulseV2);
