
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '../library';
import ChangePasswordForm from './ChangePasswordForm';
import TestForm from '../demo/TestForm';
import TooltipsTest from '../demo/TooltipsTest';
import { changePassword } from '../../thunks/user';

function Profile(props) {
  return (
    <Card>
      <ChangePasswordForm onSubmit={props.changePassword} />
      <br/><br/>
      <TestForm patient={{ firstName: 'Justin', middleName: 'Daniel', lastName: 'Sharp' }} />
      <TooltipsTest />
    </Card>
  );
}

Profile.propTypes = {
  changePassword: PropTypes.func,
};


function mapStateToProps() {
  return {
    
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    changePassword,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(Profile);
