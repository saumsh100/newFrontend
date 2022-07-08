import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import { createEntityRequest } from '../../../../../thunks/fetchEntities';
import { StandardButton as Button, ListItem } from '../../../../library';
import { MANAGER_ROLE } from '../user-role-constants';

class InviteUsersList extends Component {
  constructor(props) {
    super(props);
    this.resendInvite = this.resendInvite.bind(this);
  }

  resendInvite(id) {
    const { accountId } = this.props;

    const alert = {
      success: {
        body: 'Email Resent.',
      },
      error: {
        body: 'Email could not be resent',
      },
    };

    this.props.createEntityRequest({
      values: {},
      url: `/api/accounts/${accountId}/invites/${id}/resend`,
      alert,
    });
  }

  render() {
    const {
      email,
      date,
      onDelete,
      mainStyle,
      nameStyle,
      emailStyle,
      userListStyle,
      editStyles,
      currentUserRole,
      id,
      userIsSSO,
    } = this.props;
    const button =
      currentUserRole !== MANAGER_ROLE && !userIsSSO ? (
        <Button onClick={onDelete} className={classNames(editStyles)} icon="times" variant="danger">
          Cancel Invitation
        </Button>
      ) : null;
    const localDate = new Date(date);

    return (
      <ListItem className={userListStyle} data-test-id={email}>
        <div className={mainStyle}>
          <p className={nameStyle}>{email}</p>
          <p className={emailStyle}>
            Invited {localDate.toDateString()} {localDate.toLocaleTimeString()}
          </p>
        </div>
        {!userIsSSO && (
          <Button
            onClick={() => this.resendInvite(id)}
            className={editStyles}
            icon="envelope"
            variant="secondary"
          >
            Resend Invitation
          </Button>
        )}
        {button}
      </ListItem>
    );
  }
}

InviteUsersList.propTypes = {
  accountId: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  mainStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nameStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  emailStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  editStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userListStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  email: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentUserRole: PropTypes.string,
  createEntityRequest: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  userIsSSO: PropTypes.bool.isRequired,
};

InviteUsersList.defaultProps = {
  currentUserRole: undefined,
};

const mapStateToProps = ({ entities }) => ({
  accountId: entities.getIn(['accounts', 'models']).first().id,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ createEntityRequest }, dispatch);

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(InviteUsersList);
