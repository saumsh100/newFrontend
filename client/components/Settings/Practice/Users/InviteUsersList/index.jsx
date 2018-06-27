
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListItem, Button } from '../../../../library';
import { createEntityRequest } from '../../../../../thunks/fetchEntities';

class InviteUsersList extends Component {
  constructor(props) {
    super(props);

    this.resendInvite = this.resendInvite.bind(this);
  }

  resendInvite(id) {
    const { account } = this.props;
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
      url: `/api/accounts/${account.id}/invites/${id}/resend`,
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
    } = this.props;
    const button =
      currentUserRole !== 'MANAGER' ? (
        <Button onClick={onDelete} className={editStyles}>
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
        <Button onClick={() => this.resendInvite(id)} className={editStyles}>
          Resend Invitation
        </Button>
        {button}
      </ListItem>
    );
  }
}

InviteUsersList.propTypes = {
  activeUser: PropTypes.object,
  date: PropTypes.instanceOf(Date),
  mainStyle: PropTypes.object,
  accountId: PropTypes.object,
  nameStyle: PropTypes.object,
  emailStyle: PropTypes.object,
  editStyles: PropTypes.object,
  userListStyle: PropTypes.object,
  email: PropTypes.string,
  id: PropTypes.string,
  currentUserRole: PropTypes.string,
  createEntityRequest: PropTypes.func,
  onDelete: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return {
    account: entities.getIn(['accounts', 'models']).first(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createEntityRequest,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(InviteUsersList);
