
import { memo, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { parse } from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { loginSSO } from '../../thunks/auth';

const LoginSSO = (props) => {
  const queryVars = parse(props.location.search);
  const redirect = useCallback(() => props.push('/login'), [props]);
  const login = useCallback(() => props.loginSSO({ code: queryVars.code }).catch(redirect), [
    props,
    queryVars.code,
    redirect,
  ]);

  if (!queryVars.code) {
    return redirect();
  }
  login();
  return null;
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      loginSSO,
      push,
    },
    dispatch,
  );
}

export default connect(
  null,
  mapActionsToProps,
)(memo(LoginSSO, isEqual));
