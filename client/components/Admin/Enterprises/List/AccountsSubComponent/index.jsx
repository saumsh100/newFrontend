import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntitiesRequest, updateEntityRequest } from '../../../../../thunks/fetchEntities';
import { updateEntity } from '../../../../../reducers/entities';
import { getCollection } from '../../../../Utils';
import { switchActiveEnterprise } from '../../../../../thunks/auth';
import { accountShape } from '../../../../library/PropTypeShapes';
import AccountsTable from './AccountsTable';
import { Button, DialogBox, RemoteSubmitButton } from '../../../../library';
import RenameForm from '../../CreateAccount/RenameForm';

class AccountsSubComponent extends Component {
  editAccountFormName = 'editAccountNameForm';

  constructor(props) {
    super(props);
    this.state = {
      selectedGroupIndex: null,
      selectedGroup: null,
      editAccountNameActive: false,
    };
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  handleEditAccountNameSubmit(index, values) {
    const alert = {
      success: {
        body: 'Practice name update success',
      },
      error: {
        body: 'Practice name update failed',
      },
    };

    this.props
      .updateEntityRequest({
        id: 'enterprises',
        key: 'enterprises',
        url: `/api/enterprises/${values.enterpriseId}/accounts/${values.id}`,
        values,
        alert,
      })
      .then(() => {
        this.props.updateEntity({
          key: 'accounts',
          entity: {
            entities: {
              accounts: {
                [values.id]: values,
              },
            },
          },
        });
        this.setState({
          selectedGroup: null,
          selectedGroupIndex: null,
          editAccountNameActive: false,
        });
      });
  }

  handleEditAccountName(index, value) {
    this.setState({
      selectedGroupIndex: index,
      selectedGroup: value,
    });
    this.setEditAccountNameActive();
  }

  get editAccountNameActions() {
    return [
      {
        label: 'Cancel',
        onClick: () => this.setEditAccountNameActive(),
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: this.editAccountFormName,
        },
      },
    ];
  }

  setEditAccountNameActive() {
    this.setState((prevState) => ({
      editAccountNameActive: !prevState.editAccountNameActive,
    }));
  }

  fetchAccounts() {
    return this.props.fetchEntitiesRequest({
      key: 'accounts',
      url: `/api/enterprises/${this.props.enterpriseId}/accounts`,
    });
  }

  render() {
    const { accounts } = this.props;

    return (
      <div>
        {accounts && (
          <AccountsTable
            accounts={accounts}
            loaded={accounts.size}
            onEditName={(index, value) => this.handleEditAccountName(index, value)}
          />
        )}
        {this.state.editAccountNameActive && (
          <DialogBox
            actions={this.editAccountNameActions}
            title="Edit Practice"
            type="small"
            active={this.state.editAccountNameActive}
            onEscKeyDown={() => this.setEditAccountNameActive()}
            onOverlayClick={() => this.setEditAccountNameActive()}
          >
            <RenameForm
              key="Edit Practice"
              label="Practice"
              formName={this.editAccountFormName}
              index={this.state.selectedGroupIndex}
              initialValues={this.state.selectedGroup}
              onSubmit={(index, values) => this.handleEditAccountNameSubmit(index, values)}
            />
          </DialogBox>
        )}
      </div>
    );
  }
}

AccountsSubComponent.propTypes = {
  fetchEntitiesRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  updateEntity: PropTypes.func.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)).isRequired,
};

const stateToProps = (state, { enterpriseId }) => ({
  enterpriseId,
  accounts: getCollection(
    state,
    'accounts',
    (account) => account.get('enterpriseId') === enterpriseId,
  ),
});

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchEntitiesRequest,
      switchActiveEnterprise,
      updateEntityRequest,
      updateEntity,
    },
    dispatch,
  );
export default connect(stateToProps, dispatchToProps)(AccountsSubComponent);
