import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { updateEntityRequest, fetchEntities, createEntityRequest, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import { Toggle, Grid, Header, Button, RemoteSubmitButton, DialogBox } from '../../../library';
import RecallsList from './RecallsList';
import EditRecallsForm from './EditRecallsForm';
import styles from './styles.scss';


class Recalls extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      activeNew: false,
    };

    this.canSendRecalls = this.canSendRecalls.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.edit = this.edit.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.newRecall = this.newRecall.bind(this);
    this.deleteRecall = this.deleteRecall.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentWillMount() {
    if (this.props.activeAccount && this.props.activeAccount.id) {
      this.props.fetchEntities({
        url: `/api/accounts/${this.props.activeAccount.id}/recalls`,
      });
    }

    const canSendRecalls = this.props.activeAccount ? this.props.activeAccount.toJS().canSendRecalls : null;

    this.setState({
      canSendRecalls,
    });
  }

  componentWillReceiveProps() {
    const canSendRecalls = this.props.activeAccount ? this.props.activeAccount.toJS().canSendRecalls : null;

    if (this.state.canSendRecalls === null && this.props.activeAccount && this.props.activeAccount.id) {
      this.setState({
        canSendRecalls,
      });

      this.props.fetchEntities({
        url: `/api/accounts/${this.props.activeAccount.id}/recalls`,
      });
    }
  }

  reinitializeState() {
    const newState = {
      active: false,
      activeNew: false,
    };

    this.setState(newState);
  }

  deleteRecall(id) {
    const alert = {
      success: {
        body: 'Recall Delete',
      },
      error: {
        title: 'Clinic Recall Error',
        body: 'Failed to Delete.',
      },
    };

    this.props.deleteEntityRequest({
      url: `/api/accounts/${this.props.activeAccount.id}/recalls/${id}/`,
      key: 'recalls',
      id,
      alert,
    });
  }

  openModal() {
    const newState = {
      active: false,
      activeNew: true,
    };

    this.setState(newState);
  }

  newRecall(values) {
    const entityData = {
      lengthSeconds: values.lengthMonths * 60 * 60 * 24 * 30,
      primaryType: values.primaryType,
    };

    const alert = {
      success: {
        body: 'Recall Created',
      },
      error: {
        title: 'Clinic Recalls Error',
        body: 'Failed to create.',
      },
    };

    this.props.createEntityRequest({ url: `/api/accounts/${this.props.activeAccount.id}/recalls`, entityData, alert })
    .then(() => {
      this.setState({
        activeNew: false,
      });
      this.props.reset('newRecall');
    });
  }

  edit(id) {
    const newState = {
      active: true,
      newActive: false,
      formName: id,
    };

    this.setState(newState);
  }

  sendEdit(id, values) {
    const valuesMap = {
      lengthSeconds: values.lengthMonths * 60 * 60 * 24 * 30,
      primaryType: values.primaryType,
    };

    const alert = {
      success: {
        body: 'Updated Recalls',
      },
      error: {
        title: 'Clinic Recalls Error',
        body: 'Failed to update.',
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${this.props.activeAccount.id}/recalls/${id}`,
      values: valuesMap,
      alert,
    }).then(() => {
      this.setState({
        active: false,
      });
    });
  }

  canSendRecalls() {
    const { activeAccount } = this.props;
    const valuesMap = Map({ canSendRecalls: !this.state.canSendRecalls });
    const modifiedAccount = activeAccount.merge(valuesMap);

    const alert = {
      success: {
        body: 'Updated Recalls',
      },
      error: {
        title: 'Clinic Recalls Error',
        body: 'Failed to update.',
      },
    };
    this.props.updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
    this.setState({
      canSendRecalls: !this.state.canSendRecalls,
    });
  }

  render() {
    if (!this.props.activeAccount || !this.props.activeAccount.id) {
      return null;
    }

    const recalls = this.props.recalls.toArray().map((recall) => {
      return (<RecallsList
        key={recall.id}
        length={recall.lengthSeconds}
        primaryType={recall.primaryType}
        edit={this.edit.bind(null, recall.id)}
        deleteFunc={this.deleteRecall.bind(null, recall.id)}
      />);
    });

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.sendEdit, component: RemoteSubmitButton, props: { form: this.state.formName || 'null'} },
    ];

    const actionsNew = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.newRecall, component: RemoteSubmitButton, props: { form: 'newRecall' } },
    ];


    const showComponent = this.props.activeAccount.canSendRecalls || this.props.role === 'SUPERADMIN' ? (
      <div>
        <div className={styles.header}>
           <Header title={'Recalls'} className={styles.headerTitle} />
        </div>
        <div className={styles.createButtonContainer}>
          <Button
            className={styles.edit}
            onClick={this.openModal}
            data-test-id="createNewRecall"
            icon="plus"
            secondary
          >
            Add New Recall
          </Button>
        </div>
        {this.props.recalls.size > 0 ? <Header
          title={'Recalls List'}
          contentHeader
        /> : null }
        {recalls}
      </div>
    ) : (
      <div className={styles.disabledPage}>
        <div className={styles.disabledPage_text}>
          Recalls have been disabled. Please contact your CareCru account manager for further assistance.
        </div>
      </div>
    );
    return (
      <div className={styles.main}>
        <DialogBox
          actions={actionsNew}
          title="Recalls"
          type="small"
          active={this.state.activeNew}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <EditRecallsForm
            formName="newRecall"
            sendEdit={this.newRecall}
          />
        </DialogBox>
        <DialogBox
          key={this.state.formName || 'null'}
          actions={actions}
          title="Recalls"
          type="small"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <EditRecallsForm
            formName={this.state.formName || 'null'}
            initialValues={this.props.recalls.get(this.state.formName)}
            sendEdit={this.sendEdit.bind(null, this.state.formName)}
          />
        </DialogBox>
        {showComponent}
      </div>
    );
  }
}

Recalls.propTypes = {
  activeAccount: PropTypes.object,
  recalls: PropTypes.object,
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  createEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  role: PropTypes.string,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const role = auth.get('role');

  return {
    activeAccount,
    recalls: entities.getIn(['recalls', 'models']),
    role,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    deleteEntityRequest,
    updateEntityRequest,
    reset,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Recalls);
