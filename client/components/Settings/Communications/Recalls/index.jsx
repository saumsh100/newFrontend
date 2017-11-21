
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { updateEntityRequest, fetchEntities, createEntityRequest, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import {
  Button,
  RemoteSubmitButton,
  DialogBox,
} from '../../../library';
import { numTypeToSeconds, w2s } from '../../../../../server/util/time';
import CommunicationSettingsCard from '../../Shared/CommunicationSettingsCard';
import RecallsItem from './RecallsItem';
import CreateRecallsForm from './CreateRecallsForm';
import RecallPreview from './RecallPreview';
import IconCircle from '../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../Shared/TouchPointItem';
import styles from './styles.scss';

class Recalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      selectedRecallId: null,
    };

    this.newRecall = this.newRecall.bind(this);
    this.openModal = this.openModal.bind(this);
    this.selectRecall = this.selectRecall.bind(this);
    this.toggleAdding = this.toggleAdding.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({
      url: `/api/accounts/${this.props.activeAccount.id}/recalls`,
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

  newRecall(values) {
    const {
      primaryType,
      number,
      type,
    } = values;

    let lengthSeconds = w2s(number);
    if (type === 'after') {
      lengthSeconds = -lengthSeconds;
    }

    const entityData = {
      lengthSeconds,
      primaryType,
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

    this.props.createEntityRequest({ url: `/api/accounts/${this.props.activeAccount.id}/recalls`, entityData, alert })
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

  render() {
    if (!this.props.activeAccount || !this.props.activeAccount.id) {
      return null;
    }

    const actionsNew = [
      { label: 'Cancel', onClick: this.toggleAdding, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.newReminder, component: RemoteSubmitButton, props: { form: 'newRecall' } },
    ];

    const { activeAccount, recalls } = this.props;
    const { selectedRecallId } = this.state;
    const selectedRecall = this.props.recalls.get(selectedRecallId);

    const recallsArray = recalls.toArray();
    const lastRecall = recallsArray[recallsArray.length - 1];
    const lastRecallId = lastRecall && lastRecall.id;

    let previewComponent = null;
    if (selectedRecall) {
      previewComponent = (
        <RecallPreview
          recall={selectedRecall}
          account={activeAccount}
        />
      );
    }

    return (
      <CommunicationSettingsCard
        title="Recalls Settings"
        rightActions={(
          <Button
            onClick={this.toggleAdding}
            data-test-id="createNewReminder"
            color="blue"
          >
            Add
          </Button>
        )}

        leftColumn={(
          <div>
            {this.props.recalls.toArray().filter(r => r.lengthSeconds >= 0).map((recall, i) => {
              return (
                <RecallsItem
                  key={recall.id}
                  recall={recall}
                  account={this.props.activeAccount}
                  index={i}
                  selectRecall={this.selectRecall}
                  selected={recall.id === selectedRecallId}
                />
              );
            })}
            <TouchPointItem
              className={styles.dueDateItem}
              mainComponent={(
                <div className={styles.bottomBox}>
                  <div className={styles.bottomIconContainer}>
                    <IconCircle
                      icon="calendar"
                      color="blue"
                    />
                  </div>
                  <div className={styles.bottomLabel}>
                    <TouchPointLabel title="Due Date" />
                  </div>
                </div>
              )}
            />
            {this.props.recalls.toArray().filter(r => r.lengthSeconds < 0).map((recall, i) => {
              return (
                <RecallsItem
                  lastRecall={recall.id === lastRecallId}
                  key={recall.id}
                  recall={recall}
                  account={this.props.activeAccount}
                  index={i}
                  selectRecall={this.selectRecall}
                  selected={recall.id === selectedRecallId}
                />
              );
            })}
          </div>
        )}

        rightColumn={previewComponent}
      >
        <DialogBox
          actions={actionsNew}
          title="Add Recall"
          type="medium"
          active={this.state.isAdding}
          onEscKeyDown={this.toggleAdding}
          onOverlayClick={this.toggleAdding}
        >
          <CreateRecallsForm
            formName="newRecall"
            sendEdit={this.newRecall}
          />
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
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const recalls = entities.getIn(['recalls', 'models']).filter(r => !r.isDeleted).sortBy(r => -r.lengthSeconds);
  const role = auth.get('role');

  return {
    activeAccount,
    recalls,
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
