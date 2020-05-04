
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

const InnerComponent = React.memo(({ el, ...props }) => React.createElement(el, props), isEqual);

InnerComponent.propTypes = {
  el: PropTypes.elementType.isRequired,
};

const isEnterpriseOwner = (isEnterprisePlan, isOwner) => isEnterprisePlan && isOwner;
const ConnectedInnerComponent = connect(({ auth, featureFlags }) => {
  const role = auth.get('role');
  const isEnterprisePlan = auth.getIn(['enterprise', 'plan'], false);
  const isSuperAdmin = role === 'SUPERADMIN';
  const isOwner = role === 'OWNER' || isSuperAdmin;
  const navigationPreferencesState = featureFlags.getIn(['flags', 'navigation-preferences']);

  return {
    role,
    isSSO: auth.getIn(['user', 'isSSO']),
    navigationPreferences: navigationPreferencesState?.toJS(),
    isAuth: auth.get('isAuthenticated'),
    isSuperAdmin,
    withEnterprise: isEnterpriseOwner(isEnterprisePlan, isOwner),
    enterpriseId: auth.get('enterpriseId'),
  };
})(InnerComponent);

export default el => props => (
  <ConnectedInnerComponent
    {...{
      ...props,
      el,
    }}
  />
);
