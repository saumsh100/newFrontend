
import React from 'react';
import { omit } from 'lodash';
import { connect } from 'react-redux';

const InnerComponent = props =>
  <props.el {...omit(props, 'el')} />;

const ConnectedInnerComponent = connect((state) => {
  const session = state.auth.toJS();
  const isSuperAdmin = session.role === 'SUPERADMIN';
  const isEnterpriseOwner = () => isSuperAdmin;

  return {
    isAuth: session.isAuthenticated,
    isSuperAdmin,
    withEnterprise: isEnterpriseOwner(),
    enterpriseId: session.enterpriseId,
  };
})(InnerComponent);

const withAuthProps = el =>
  props => <ConnectedInnerComponent {...({ ...props, el })} />;

export default withAuthProps;
