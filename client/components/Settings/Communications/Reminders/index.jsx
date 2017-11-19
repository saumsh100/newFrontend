
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
import CreateRemindersForm from './CreateRemindersForm';
import ReminderPreview from './ReminderPreview';
import styles from './styles.scss';

class Reminders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      selectedReminderId: null,
    };

    this.newReminder = this.newReminder.bind(this);
    this.openModal = this.openModal.bind(this);
    this.selectReminder = this.selectReminder.bind(this);
    this.toggleAdding = this.toggleAdding.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({
      url: `/api/accounts/${this.props.activeAccount.id}/reminders`,
    });
  }

  toggleAdding() {
    this.setState({ isAdding: !this.state.isAdding });
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
          isAdding: false,
        });

        this.props.reset('newReminder');
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

    const { activeAccount } = this.props;
    const { selectedReminderId } = this.state;
    const selectedReminder = this.props.reminders.get(selectedReminderId);

    let previewComponent = null;
    if (selectedReminder) {
      previewComponent = (
        <ReminderPreview
          reminder={selectedReminder}
          account={activeAccount}
        />
      );
    }

    return (
      <SettingsCard
        title="Reminders Settings"
        rightActions={(
          <Button
            className={styles.edit}
            onClick={this.toggleAdding}
            data-test-id="createNewReminder"
            color="blue"
          >
            Add
          </Button>
        )}
      >
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
                    selectReminder={this.selectReminder}
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
          title="Add Reminder"
          type="small"
          active={this.state.isAdding}
          onEscKeyDown={this.toggleAdding}
          onOverlayClick={this.toggleAdding}
        >
          <CreateRemindersForm
            formName="newReminder"
            sendEdit={this.newReminder}
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
  const reminders = entities.getIn(['reminders', 'models']).filter(r => !r.isDeleted).sortBy(r => -r.lengthSeconds);
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
