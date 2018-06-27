
import React from 'react';
import { omit } from 'lodash';
import { connect } from 'react-redux';

const InnerComponent = props => <props.el {...omit(props, 'el')} />;

const ConnectedInnerComponent = connect((state) => {
  const session = state.auth.toJS();
  const { role, enterprise } = session;
  const isSuperAdmin = role === 'SUPERADMIN';
  const isOwner = role === 'OWNER' || isSuperAdmin;
  const isEnterprisePlan = !!enterprise && enterprise.plan === 'ENTERPRISE';
  const isEnterpriseOwner = () => isEnterprisePlan && isOwner;

  return {
    role,
    isAuth: session.isAuthenticated,
    isSuperAdmin,
    withEnterprise: isSuperAdmin, // isEnterpriseOwner(),
    enterpriseId: session.enterpriseId,
  };
})(InnerComponent);

const withAuthProps = el => props => (
  <ConnectedInnerComponent {...{ ...props, el }} />
);

export default withAuthProps;
