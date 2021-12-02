import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import historyShape from '../../components/library/PropTypeShapes/historyShape';
import locationShape from '../../components/library/PropTypeShapes/locationShape';
import userShape from '../../components/library/PropTypeShapes/patientUserShape';
import AccountModel from '../../entities/models/Account';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import MicroFrontEnd from '../micro-front-end';

const { FORMS_HOST: formsHost } = process.env;

const Forms = React.memo(({ history, location, match, ...rest }) => {
  delete rest.dispatch; // no need for redux at this time
  try {
    history.location.state = rest; // put the required info in to the route state
  } catch (error) {
    history.location.state = undefined;
  }

  const props = useMemo(() => ({ history, location, match }), [history, location, match]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MicroFrontEnd host={formsHost} name="Forms" {...props} />;
});

Forms.defaultProps = {};

Forms.propTypes = {
  activeAccount: PropTypes.instanceOf(AccountModel).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  match: PropTypes.shape({}).isRequired,
  user: PropTypes.shape(userShape).isRequired,
  role: PropTypes.string.isRequired,
  useFormSubmission: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ entities, auth, featureFlags }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const useFormSubmission = isDev
    ? true
    : isFeatureEnabledSelector(featureFlags.get('flags'), 'use-form-submission');
  return {
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]).toJS(),
    useFormSubmission,
  };
};

export default connect(mapStateToProps)(Forms);
