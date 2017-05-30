
import React from 'react';
import { omit } from 'lodash';
import { connect } from 'react-redux';

const InnerComponent = props =>
  <props.el {...omit(props, 'el')} />;

const ConnectedInnerComponent = connect((state) => {
  const token = state.auth.get('token');
  const isSuperAdmin = (token && token.get('role')) === 'SUPERADMIN';
  const isEnterpriseOwner = () => true;

  return {
    isAuth: state.auth.get('isAuthenticated'),
    isSuperAdmin,
    withEnterprise: isSuperAdmin || isEnterpriseOwner(),
  };
})(InnerComponent);

const withAuthProps = el =>
  props => <ConnectedInnerComponent {...({ ...props, el })} />;

export default withAuthProps;
