
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import {
  updateEntityRequest,
  fetchEntities,
  createEntityRequest,
  deleteEntityRequest,
} from '../../../../thunks/fetchEntities';
import {
  Grid,
  Row,
  Col,
  Button,
  RemoteSubmitButton,
  DialogBox,
  DropdownSelect,
} from '../../../library';
import { convertIntervalToMs, w2s, s2m, m2s } from '../../../../../server/util/time';
import CommunicationSettingsCard from '../../Shared/CommunicationSettingsCard';
import RecallsItem from './RecallsItem';
import AdvancedSettingsForm from './AdvancedSettingsForm';
import CreateRecallsForm from './CreateRecallsForm';
import RecallPreview from './RecallPreview';
import IconCircle from '../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../Shared/TouchPointItem';
import styles from './styles.scss';

const dueDateOptions = [
  { label: '4 Mos', value: '4 months' },
  { label: '5 Mos', value: '5 months' },
  { label: '6 Mos', value: '6 months' },
  { label: '7 Mos', value: '7 months' },
  { label: '8 Mos', value: '8 months' },
  { label: '9 Mos', value: '9 months' },
  { label: '10 Mos', value: '10 months' },
  { label: '11 Mos', value: '11 months' },
  { label: '12 Mos', value: '12 months' },
];

class Recalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      isAdvancedSettingsOpen: false,
      selectedRecallId: null,
    };

    this.saveAdvancedSettings = this.saveAdvancedSettings.bind(this);
    this.newRecall = this.newRecall.bind(this);
    this.openModal = this.openModal.bind(this);
    this.selectRecall = this.selectRecall.bind(this);
    this.toggleAdding = this.toggleAdding.bind(this);
    this.toggleAdvancedSettings = this.toggleAdvancedSettings.bind(this);
    this.changeRecareDate = this.changeRecareDate.bind(this);
    this.changeHygieneDate = this.changeHygieneDate.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({
      url: `/api/accounts/${this.props.activeAccount.id}/recalls`,
    });
  }

  toggleAdding() {
    this.setState({ isAdding: !this.state.isAdding });
  }

  toggleAdvancedSettings() {
    this.setState({ isAdvancedSettingsOpen: !this.state.isAdvancedSettingsOpen });
  }

  openModal() {
    const newState = {
      active: false,
      activeNew: true,
    };

    this.setState(newState);
  }

  saveAdvancedSettings(values) {
    const { activeAccount } = this.props;
    const { recallBufferNumber, recallBufferInterval, recallStartTime, recallEndTime } = values;

    const newValues = {
      recallBuffer: `${recallBufferNumber} ${recallBufferInterval}`,
      recallStartTime,
      recallEndTime,
    };

    const alert = {
      success: {
        title: 'Recall Settings Updated',
        body: 'Successfully updated the advanced settings for recalls',
      },

      error: {
        title: 'Failed to Update Recall Settings',
        body: 'Error trying to update the advanced settings for recalls',
      },
    };

    this.props
      .updateEntityRequest({ url: `/api/accounts/${activeAccount.id}`, values: newValues, alert })
      .then(this.toggleAdvancedSettings);
  }

  newRecall(values) {
    const { primaryType, interval, type } = values;

    let { number } = values;
    if (type === 'after') {
      number = -number;
    }

    const entityData = {
      interval: `${number} ${interval}`,
      primaryTypes: primaryType.split('_'),
    };

    const alert = {
      success: {
        title: 'Recall Created',
        body: 'Successfully created the recall',
      },

      error: {
        title: 'Error Creating Recall',
        body: 'Failed to create recall',
      },
    };

    this.props
      .createEntityRequest({
        url: `/api/accounts/${this.props.activeAccount.id}/recalls`,
        entityData,
        alert,
      })
      .then(() => {
        this.setState({
          isAdding: false,
        });

        this.props.reset('newRecall');
      });
  }

  selectRecall(recallId) {
    if (recallId === this.state.selectedRecallId) {
      return;
    }

    this.setState({ selectedRecallId: recallId });
  }

  changeHygieneDate(val) {
    const values = { hygieneInterval: val };
    const alert = {
      success: {
        title: 'Account Updated',
        body: `Successfully updated the default hygiene due date to ${val[0]} months`,
      },

      error: {
        title: 'Failed to Update Account',
        body: `Error trying to update the default hygiene due date to ${val[0]} months`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${this.props.activeAccount.id}`,
      values,
      alert,
    });
  }

  changeRecareDate(val) {
    const values = { recallInterval: val };
    const alert = {
      success: {
        title: 'Account Updated',
        body: `Successfully updated the default recare due date to ${val[0]} months`,
      },

      error: {
        title: 'Failed to Update Account',
        body: `Error trying to update the default recare due date to ${val[0]} months`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${this.props.activeAccount.id}`,
      values,
      alert,
    });
  }

  render() {
    const { activeAccount, recalls, role } = this.props;
    const { selectedRecallId } = this.state;

    if (!activeAccount || !activeAccount.id) {
      return null;
    }

    const advancedSettingsActions = [
      {
        label: 'Cancel',
        onClick: this.toggleAdvancedSettings,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.saveAdvancedSettings,
        component: RemoteSubmitButton,
        props: { color: 'blue', form: 'recallAdvancedSettings' },
      },
    ];

    const arr = activeAccount.recallBuffer.split(' ');
    const advancedValues = {
      recallBufferNumber: arr[0],
      recallBufferInterval: arr[1],
      recallStartTime: activeAccount.recallStartTime,
      recallEndTime: activeAccount.recallEndTime,
    };

    const addRecallActions = [
      { label: 'Cancel', onClick: this.toggleAdding, component: Button, props: { border: 'blue' } },
      {
        label: 'Save',
        onClick: this.newReminder,
        component: RemoteSubmitButton,
        props: { color: 'blue', form: 'newRecall' },
      },
    ];

    const selectedRecall = this.props.recalls.get(selectedRecallId);

    const recallsArray = recalls.toArray();
    const lastRecall = recallsArray[recallsArray.length - 1];
    const lastRecallId = lastRecall && lastRecall.id;

    let previewComponent = null;
    if (selectedRecall) {
      previewComponent = <RecallPreview recall={selectedRecall} account={activeAccount} />;
    }

    const numHygieneMonths = activeAccount.hygieneInterval || '6 months';
    const numRecareMonths = activeAccount.recallInterval || '6 months';

    return (
      <CommunicationSettingsCard
        title="Recalls Settings"
        // TODO: we have removed add button for now
        rightActions={
          role === 'SUPERADMIN' ? (
            <div>
              <Button border="blue" onClick={this.toggleAdvancedSettings}>
                Advanced Settings
              </Button>
              <Button
                onClick={this.toggleAdding}
                data-test-id="button_createNewRecall"
                color="blue"
              >
                Add
              </Button>
            </div>
          ) : null
        }
        leftColumn={
          <div>
            {this.props.recalls
              .toArray()
              .filter(r => convertIntervalToMs(r.interval) >= 0)
              .map((recall, i) => (
                <RecallsItem
                  key={recall.id}
                  recall={recall}
                  account={this.props.activeAccount}
                  index={i}
                  selectRecall={this.selectRecall}
                  selected={recall.id === selectedRecallId}
                />
              ))}
            <TouchPointItem
              className={styles.dueDateItem}
              linesBoxClass={styles.dueDateLinesBox}
              labelComponent={
                <div className={styles.dueDateWrapper}>
                  <TouchPointLabel title="Due Date" className={styles.dueDateLabel} />
                </div>
              }
              mainComponent={
                <div className={styles.bottomBox}>
                  <div className={styles.bottomIconContainer}>
                    <IconCircle icon="calendar" color="blue" />
                  </div>
                  <div className={styles.bottomLabel}>
                    <Grid>
                      <Row className={styles.bottomRow}>
                        <Col xs={6} className={styles.leftCol}>
                          <div className={styles.dropdownWrapper}>
                            <DropdownSelect
                              label="Hygiene"
                              className={styles.dueDateDropdown}
                              value={numHygieneMonths}
                              options={dueDateOptions}
                              onChange={this.changeHygieneDate}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className={styles.rightCol}>
                          <div className={styles.dropdownWrapper}>
                            <DropdownSelect
                              label="Recall"
                              className={styles.dueDateDropdown}
                              value={numRecareMonths}
                              options={dueDateOptions}
                              onChange={this.changeRecareDate}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Grid>
                  </div>
                </div>
              }
            />
            {this.props.recalls
              .toArray()
              .filter(r => convertIntervalToMs(r.interval) < 0)
              .map((recall, i) => (
                <RecallsItem
                  lastRecall={recall.id === lastRecallId}
                  key={recall.id}
                  recall={recall}
                  account={this.props.activeAccount}
                  index={i}
                  selectRecall={this.selectRecall}
                  selected={recall.id === selectedRecallId}
                />
              ))}
          </div>
        }
        rightColumn={previewComponent}
      >
        <DialogBox
          actions={advancedSettingsActions}
          title="Recalls Advanced Settings"
          type="medium"
          active={this.state.isAdvancedSettingsOpen}
          onEscKeyDown={this.toggleAdvancedSettings}
          onOverlayClick={this.toggleAdvancedSettings}
        >
          <AdvancedSettingsForm
            initialValues={advancedValues}
            onSubmit={this.saveAdvancedSettings}
          />
        </DialogBox>
        <DialogBox
          actions={addRecallActions}
          title="Add Recall"
          type="medium"
          active={this.state.isAdding}
          onEscKeyDown={this.toggleAdding}
          onOverlayClick={this.toggleAdding}
        >
          <CreateRecallsForm formName="newRecall" sendEdit={this.newRecall} />
        </DialogBox>
      </CommunicationSettingsCard>
    );
  }
}

Recalls.propTypes = {
  activeAccount: PropTypes.object,
  recalls: PropTypes.object,
  role: PropTypes.string,
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  createEntityRequest: PropTypes.func,
  reset: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const role = auth.get('role');
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const recalls = entities
    .getIn(['recalls', 'models'])
    .filter(r => !r.isDeleted && !!r.interval)
    .sortBy(r => -convertIntervalToMs(r.interval));

  return {
    activeAccount,
    recalls,
    role,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      createEntityRequest,
      deleteEntityRequest,
      updateEntityRequest,
      reset,
    },
    dispatch
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Recalls);
