
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import { Card } from '../library';
import ChangePasswordForm from './ChangePasswordForm';
import { changePassword } from '../../thunks/user';
import styles from './styles.scss';

function Profile(props) {
  return (
    <DocumentTitle title="CareCru | Profile">
      <Card className={styles.cardContainer}>
        <div className={styles.passwordFormContainer}>
          <ChangePasswordForm onSubmit={props.changePassword} />
        </div>
      </Card>
    </DocumentTitle>
  );
}

Profile.propTypes = {
  changePassword: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      changePassword,
    },
    dispatch,
  );
}

const enhance = connect(
  null,
  mapActionsToProps,
);

export default enhance(Profile);
