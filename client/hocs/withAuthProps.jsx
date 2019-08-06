
import React, { Component } from 'react';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

class InnerComponent extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    return <this.props.el {...omit(this.props, 'el')} />;
  }
}

const ConnectedInnerComponent = connect(({ auth, featureFlags }) => {
  const session = auth.toJS();
  const { role, enterprise } = session;
  const isSuperAdmin = role === 'SUPERADMIN';
  const isOwner = role === 'OWNER' || isSuperAdmin;
  const isEnterprisePlan = !!enterprise && enterprise.plan === 'ENTERPRISE';
  const isEnterpriseOwner = () => isEnterprisePlan && isOwner;
  const navigationPreferencesState = featureFlags.getIn(['flags', 'navigation-preferences']);
  const navigationPreferences = navigationPreferencesState && navigationPreferencesState.toJS();

  return {
    role,
    navigationPreferences,
    isAuth: session.isAuthenticated,
    isSuperAdmin,
    withEnterprise: isEnterpriseOwner(),
    enterpriseId: session.enterpriseId,
  };
})(InnerComponent);

const withAuthProps = el => props => (
  <ConnectedInnerComponent
    {...{
      ...props,
      el,
    }}
  />
);

export default withAuthProps;
