
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import { Card } from '../library';
import ChangePasswordForm from './ChangePasswordForm';
import TestForm from '../demo/TestForm';
import TooltipsTest from '../demo/TooltipsTest';
import { changePassword } from '../../thunks/user';
import styles from './styles.scss';

function Profile(props) {
  return (
    <DocumentTitle title="CareCru | Profile">
      <Card className={styles.cardContainer}>
        <div className={styles.passwordFormContainer}>
          <ChangePasswordForm onSubmit={props.changePassword} />
        </div>
        {/* <TestForm patient={{ firstName: 'Justin', middleName: 'Daniel', lastName: 'Sharp' }} /> */}
        {/* <TooltipsTest /> */}
      </Card>
    </DocumentTitle>
  );
}

Profile.propTypes = {
  changePassword: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      changePassword,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapActionsToProps,
);

export default enhance(Profile);
