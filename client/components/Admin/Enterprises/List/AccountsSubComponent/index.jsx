import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { deleteEntityRequest, updateEntityRequest } from '../../../../../thunks/fetchEntities';
import { deleteEntity, updateEntity } from '../../../../../reducers/entities';
import { getCollection } from '../../../../Utils';
import { switchActiveEnterprise } from '../../../../../thunks/auth';
import { accountShape } from '../../../../library/PropTypeShapes';
import AccountsTable from './AccountsTable';
import { Button, DialogBox, RemoteSubmitButton } from '../../../../library';
import PracticeForm from '../../CreateAccount/PracticeForm';
import { getAlertData } from '../Shared/helpers';

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

  handleEditAccountNameSubmit(index, values) {
    this.props
      .updateEntityRequest({
        id: 'enterprises',
        key: 'enterprises',
        url: `/api/enterprises/${values.enterpriseId}/accounts/${values.id}`,
        values,
        alert: getAlertData('Practice', 'update'),
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

  handleDeleteAccount(index, value) {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${value.name}?`);

    if (confirmDelete) {
      this.props
        .deleteEntityRequest({
          value,
          id: value.id,
          key: 'enterprises',
          url: `/api/enterprises/${value.enterpriseId}/accounts/${value.id}`,
          alert: getAlertData('Practice', 'delete'),
        })
        .then(() => {
          this.props.deleteEntity({
            key: 'accounts',
            id: value.id,
          });
        });
    }
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

  render() {
    const { accounts } = this.props;

    return (
      <div>
        {accounts && (
          <AccountsTable
            accounts={accounts}
            loaded={accounts.size}
            onEditName={(index, value) => this.handleEditAccountName(index, value)}
            onDeleteAccount={(index, value) => this.handleDeleteAccount(index, value)}
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
            <PracticeForm
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
  deleteEntity: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  updateEntity: PropTypes.func.isRequired,
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
      deleteEntity,
      deleteEntityRequest,
      switchActiveEnterprise,
      updateEntityRequest,
      updateEntity,
    },
    dispatch,
  );
export default connect(stateToProps, dispatchToProps)(AccountsSubComponent);
