
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { updateEntityRequest, fetchEntities, createEntityRequest, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import {
  Grid,
  Row,
  Col,
  Icon,
  Header,
  Button,
  RemoteSubmitButton,
  DialogBox,
} from '../../../library';
import SettingsCard from '../../Shared/SettingsCard';
import RemindersItem from './RemindersItem';
import EditRemindersForm from './EditRemindersForm';
import ReminderPreview from './ReminderPreview';
import styles from './styles.scss';

class Reminders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      activeNew: false,
      selectedReminderId: null,
    };

    this.canSendReminders = this.canSendReminders.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.edit = this.edit.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.deleteReminders = this.deleteReminders.bind(this);
    this.newReminder = this.newReminder.bind(this);
    this.openModal = this.openModal.bind(this);
    this.selectReminder = this.selectReminder.bind(this);
  }

  componentWillMount() {
    if (this.props.activeAccount && this.props.activeAccount.id) {
      this.props.fetchEntities({
        url: `/api/accounts/${this.props.activeAccount.id}/reminders`,
      });
    }

    const canSendReminders = this.props.activeAccount ? this.props.activeAccount.toJS().canSendReminders : null;

    this.setState({
      canSendReminders,
    });
  }

  componentWillReceiveProps() {
    const canSendReminders = this.props.activeAccount ? this.props.activeAccount.toJS().canSendReminders : null;

    if (this.state.canSendReminders === null && this.props.activeAccount && this.props.activeAccount.id) {
      this.setState({
        canSendReminders,
      });
      this.props.fetchEntities({
        url: `/api/accounts/${this.props.activeAccount.id}/reminders`,
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

  deleteReminders(id) {
    const alert = {
      success: {
        body: 'Reminder Delete',
      },
      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to Delete.',
      },
    };

    this.props.deleteEntityRequest({
      url: `/api/accounts/${this.props.activeAccount.id}/reminders/${id}/`,
      key: 'reminders',
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

  selectReminder(reminderId) {
    if (reminderId === this.state.selectedReminderId) {
      return;
    }

    this.setState({ selectedReminderId: reminderId });
  }

  render() {
    if (!this.props.activeAccount || !this.props.activeAccount.id) {
      return null;
    }

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.sendEdit, component: RemoteSubmitButton, props: { form: this.state.formName || 'null'} },
    ];

    const actionsNew = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.newReminder, component: RemoteSubmitButton, props: { form: 'newReminder' } },
    ];


    /*const showComponent = this.props.activeAccount.canSendReminders || this.props.role === 'SUPERADMIN' ? (<div>
      <div className={styles.header}>
        <Header title={'Reminders'} className={styles.headerTitle} />
      </div>
      <div className={styles.createButtonContainer}>
        <Button
          className={styles.edit}
          onClick={this.openModal}
          data-test-id="createNewReminder"
          icon="plus"
          secondary
        >
          Add New Reminder
        </Button>
      </div>
      {this.props.reminders.size > 0 ? <Header title={'Reminders List'} contentHeader /> : null }
      {reminders}
    </div>) : (<div className={styles.disabledPage}>
      <div className={styles.disabledPage_text}>
        Reminders have been disabled. Please contact your CareCru account manager for further assistance.
      </div>
    </div>);*/

    const { selectedReminderId } = this.state;
    const selectedReminder = this.props.reminders.get(selectedReminderId);

    let previewComponent = null;
    if (selectedReminder) {
      previewComponent = (
        <ReminderPreview
          reminder={selectedReminder}
        />
      );
    }

    return (
      <SettingsCard
        title="Reminders Settings"
      >
        {/*<div className={styles.createButtonContainer}>
            <Button
              className={styles.edit}
              onClick={this.openModal}
              data-test-id="createNewReminder"
              icon="plus"
              secondary
            >
              Add New Reminder
            </Button>
          </div>*/}
        <Grid className={styles.remindersGrid}>
          <Row className={styles.remindersRow}>
            <Col
              xs={6}
              className={styles.remindersListCol}
            >
              {this.props.reminders.toArray().map((reminder, i) => {
                return (
                  <RemindersItem
                    key={reminder.id}
                    reminder={reminder}
                    account={this.props.activeAccount}
                    index={i}
                    onSelect={() => this.selectReminder(reminder.id)}
                    selected={reminder.id === selectedReminderId}
                  />
                );
              })}
              <Grid className={styles.finalItem}>
                <Row>
                  <Col xs={1}>
                    {/* Keep Empty */}
                  </Col>
                  <Col xs={3}>
                    <div>
                      Appointment
                    </div>
                  </Col>
                  <Col xs={8}>
                    <Icon icon="calendar" />
                  </Col>
                </Row>
              </Grid>
            </Col>
            <Col xs={6}>
              {previewComponent}
            </Col>
          </Row>
        </Grid>
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
      </SettingsCard>
    );
  }
}

Reminders.propTypes = {
  activeAccount: PropTypes.object,
  reminders: PropTypes.object,
  role: PropTypes.string,
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  createEntityRequest: PropTypes.func,
  reset: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const reminders = entities.getIn(['reminders', 'models']).sortBy(r => -r.lengthSeconds);
  const role = auth.get('role');

  return {
    activeAccount,
    reminders,
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

export default enhance(Reminders);
