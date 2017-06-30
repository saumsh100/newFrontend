import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { updateEntityRequest, fetchEntities, createEntityRequest } from '../../../../thunks/fetchEntities';
import { Toggle, Grid, Header, Button, RemoteSubmitButton, DialogBox } from '../../../library';
import RemindersList from './RemindersList';
import EditRemindersForm from './EditRemindersForm';
import styles from './styles.scss';


class Reminders extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      activeNew: false,
    };

    this.canSendReminders = this.canSendReminders.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.edit = this.edit.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.newReminder = this.newReminder.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({
      url: `/api/accounts/${this.props.activeAccount.id}/reminders`,
    });

    this.setState({
      canSendReminders: this.props.activeAccount.toJS().canSendReminders,
    });
  }

  reinitializeState() {
    const newState = {
      active: false,
      activeNew: false,
    };

    this.setState(newState);
  }

  openModal() {
    const newState = {
      active: false,
      activeNew: true,
    };

    this.setState(newState);
  }

  newReminder(values) {
    const entityData = {
      lengthSeconds: values.lengthHours * 60 * 60,
      primaryType: values.primaryType,
    };

    const alert = {
      success: {
        body: 'Reminder Created',
      },
      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to create.',
      },
    };

    this.props.createEntityRequest({ url: `/api/accounts/${this.props.activeAccount.id}/reminders`, entityData, alert })
    .then(() => {
      this.setState({
        activeNew: false,
      });
      this.props.reset('newReminder');
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
      lengthSeconds: values.lengthHours * 60 * 60,
      primaryType: values.primaryType,
    };

    const alert = {
      success: {
        body: 'Updated Reminders',
      },
      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to update.',
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${this.props.activeAccount.id}/reminders/${id}`,
      values: valuesMap,
      alert,
    }).then(() => {
      this.setState({
        active: false,
      });
    });
  }

  canSendReminders() {
    const { activeAccount } = this.props;
    const valuesMap = Map({ canSendReminders: !this.state.canSendReminders });
    const modifiedAccount = activeAccount.merge(valuesMap);

    const alert = {
      success: {
        body: 'Updated Reminders',
      },
      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to update.',
      },
    };
    this.props.updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
    this.setState({
      canSendReminders: !this.state.canSendReminders,
    });
  }

  render() {

    const reminders = this.props.reminders.toArray().map((reminder) => {
      return (<RemindersList
        length={reminder.lengthSeconds}
        primaryType={reminder.primaryType}
        edit={this.edit.bind(null, reminder.id)}
      />);
    });

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.sendEdit, component: RemoteSubmitButton, props: { form: this.state.formName || 'null'} },
    ];

    const actionsNew = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.newReminder, component: RemoteSubmitButton, props: { form: 'newReminder' } },
    ];

    return (
      <Grid>
        <DialogBox
          actions={actionsNew}
          title="Reminders"
          type="small"
          active={this.state.activeNew}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <EditRemindersForm
            formName="newReminder"
            sendEdit={this.newReminder}
          />
        </DialogBox>
        <DialogBox
          key={this.state.formName || 'null'}
          actions={actions}
          title="Reminders"
          type="small"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <EditRemindersForm
            formName={this.state.formName || 'null'}
            initialValues={this.props.reminders.get(this.state.formName)}
            sendEdit={this.sendEdit.bind(null, this.state.formName)}
          />
        </DialogBox>
        <div className={styles.header}>
          <Header title={'Reminders'} className={styles.headerTitle} />
          <Button className={styles.edit} onClick={this.openModal}>Create New</Button>
        </div>
        <div className={styles.toggle}>
        Reminders ON/OFF:&nbsp;
          <Toggle
            name="canSendReminders"
            onChange={this.canSendReminders}
            checked={this.state.canSendReminders}
          />
        </div>
        <Header title={'Reminders List'} className={styles.headerTitle} />
        {reminders}
      </Grid>
    );
  }
}

Reminders.propTypes = {
  activeAccount: PropTypes.object,
  reminders: PropTypes.object,
  updateEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  createEntityRequest: PropTypes.func,
  reset: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  return {
    activeAccount,
    reminders: entities.getIn(['reminders', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    reset,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Reminders);
