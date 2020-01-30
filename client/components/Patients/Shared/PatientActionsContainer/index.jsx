
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import {
  setSelectedNote,
  setSelectedFollowUp,
  setSelectedRecall,
  setIsNoteFormActive,
  setIsFollowUpsFormActive,
  setIsRecallsFormActive,
} from '../../../../reducers/patientTable';
import FormModal from '../../PatientInfo/FormModal';
import NotesForm from '../../PatientInfo/Notes/NotesForm';
import FollowUpsForm from '../../PatientInfo/FollowUps/FollowUpsForm';
import LogRecallForm from '../../PatientInfo/SentRecalls/LogRecallForm';
import CreateOrUpdatePatientNoteMutation from '../../PatientInfo/Notes/CreateOrUpdatePatientNoteMutation';
import CreateOrUpdateFollowUpMutation from '../../PatientInfo/FollowUps/CreateOrUpdateFollowUpMutation';
import CreateOrUpdateSentRecallMutation from '../../PatientInfo/SentRecalls/CreateOrUpdateSentRecallMutation';
import { receiveEntities } from '../../../../reducers/entities';
import PatientModel from '../../../../entities/models/Patient';
import AccountModel from '../../../../entities/models/Account';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { showAlertTimeout } from '../../../../thunks/alerts';
import styles from './styles.scss';

const getNotesFormName = data => (data ? `editNotesForm-${data.id}` : 'addNotesForm');
const getFollowUpsFormName = data => (data ? `editFollowUpsForm-${data.id}` : 'addFollowUpsForm');
const getRecallsFormName = data => (data ? `editRecallsForm-${data.id}` : 'logRecallsForm');

const updateRecallConfirmation =
  'Are you sure you want to update this logged recall? ' +
  'This change will not be reflected in the communication logs ' +
  'in your Practice Management Software.';

class PatientActionsContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleForm = this.toggleForm.bind(this);
    this.handleNotesFormSubmit = this.handleNotesFormSubmit.bind(this);
    this.handleFollowUpsFormSubmit = this.handleFollowUpsFormSubmit.bind(this);
    this.handleSentRecallFormSubmit = this.handleSentRecallFormSubmit.bind(this);
  }

  toggleForm(selectedData, setSelectedData, setFormActive) {
    return () => {
      if (selectedData) {
        setSelectedData(null);
      } else {
        setFormActive(false);
      }
    };
  }

  async handleNotesFormSubmit({ note }, commit) {
    const { activePatient, activeAccount, userId, selectedNote } = this.props;
    try {
      const variables = {
        note,
        patientId: activePatient.id,
        accountId: activeAccount.id,
        userId,
      };

      if (selectedNote) {
        variables.id = selectedNote.id;
      }

      const { data } = await commit({ variables });
      this.toggleForm(selectedNote, this.props.setSelectedNote, this.props.setIsNoteFormActive)();

      // Get created ID or use the ID of the note you are editing
      const newNote = selectedNote ? data.updatePatientNote : data.createPatientNote;
      const eventId = window.btoa(`note-${newNote.id}`);

      // This is temporary as the API is not properly return this data for create actions
      newNote.date = newNote.date || new Date().toISOString();
      newNote.createdAt = newNote.date;

      this.props.receiveEntities({
        entities: {
          patientTimelineEvents: {
            [eventId]: {
              id: eventId,
              type: 'note',
              accountId: newNote.accountId,
              patientId: newNote.patientId,
              metaData: newNote,
            },
          },
        },
      });

      this.props.showAlertTimeout({
        type: 'success',
        alert: {
          body: `${selectedNote ? 'Updated' : 'Added'} note for ${activePatient.firstName}`,
        },
      });

      this.props.reset(getNotesFormName(selectedNote));
    } catch (err) {
      console.error('handleNotesFormSubmit Error:', err);
      this.props.showAlertTimeout({
        type: 'error',
        alert: {
          body: `Failed to ${selectedNote ? 'update' : 'add'} note for ${activePatient.firstName}`,
        },
      });
    }
  }

  async handleFollowUpsFormSubmit(values, commit) {
    const { activePatient, activeAccount, userId, selectedFollowUp } = this.props;
    try {
      const variables = {
        patientId: activePatient.id,
        accountId: activeAccount.id,
        userId,
        assignedUserId: values.assignedUserId,
        dueAt: values.dueAt,
        patientFollowUpTypeId: values.patientFollowUpTypeId,
        note: values.note,
      };

      if (selectedFollowUp) {
        variables.id = selectedFollowUp.id;
        if (values.isCompleted && !selectedFollowUp.completedAt) {
          variables.completedAt = new Date();
        }

        if (!values.isCompleted && selectedFollowUp.completedAt) {
          variables.completedAt = null;
        }
      }

      const { data } = await commit({ variables });

      this.toggleForm(
        selectedFollowUp,
        this.props.setSelectedFollowUp,
        this.props.setIsFollowUpsFormActive,
      )();

      const newFollowUp = selectedFollowUp
        ? data.updatePatientFollowUp
        : data.createPatientFollowUp;
      const eventId = window.btoa(`followUp-${newFollowUp.id}`);

      // This is temporary as the API is not properly return this data for create actions
      newFollowUp.date = newFollowUp.date || new Date().toISOString();
      newFollowUp.createdAt = newFollowUp.date;

      this.props.receiveEntities({
        entities: {
          patientTimelineEvents: {
            [eventId]: {
              id: eventId,
              type: 'followUp',
              accountId: newFollowUp.accountId,
              patientId: newFollowUp.patientId,
              assignedUserId: newFollowUp.assignedUserId,
              metaData: newFollowUp,
            },
          },
        },
      });

      this.props.showAlertTimeout({
        type: 'success',
        alert: {
          body: `${selectedFollowUp ? 'Updated' : 'Added'} follow-up for ${
            activePatient.firstName
          }`,
        },
      });

      this.props.reset(getFollowUpsFormName(selectedFollowUp));
    } catch (err) {
      console.error('handleFollowUpsFormSubmit Error:', err);
      this.props.showAlertTimeout({
        type: 'error',
        alert: {
          body:
            `Failed to ${selectedFollowUp ? 'update' : 'add'} ` +
            `follow-up for ${activePatient.firstName}`,
        },
      });
    }
  }

  async handleSentRecallFormSubmit(values, commit) {
    const { patientFamily } = values;
    const { activePatient, activeAccount, userId, selectedRecall } = this.props;
    try {
      const variables = {
        ...values,
        accountId: activeAccount.id,
        userId,
      };

      const toggleForm = this.toggleForm(
        selectedRecall,
        this.props.setSelectedRecall,
        this.props.setIsRecallsFormActive,
      );

      if (selectedRecall) {
        variables.id = selectedRecall.id;
        if (!window.confirm(updateRecallConfirmation)) {
          toggleForm();
          this.props.reset(getRecallsFormName(selectedRecall));
          return;
        }
      }

      // make a recall for each family member
      const dataArr = await Promise.all(
        patientFamily.map(async (id) => {
          const recallForm = {
            ...variables,
            patientId: id,
          };
          const res = await commit({ variables: recallForm });
          return res;
        }),
      );

      toggleForm();

      // find and update current patient from the array or update the only patient
      const { data } =
        dataArr.find((e) => {
          if (selectedRecall) {
            return e.data.updateSentRecall.patientId === activePatient.id;
          }
          return e.data.createManualSentRecall.patientId === activePatient.id;
        }) || dataArr[0];

      const newRecall = selectedRecall ? data.updateSentRecall : data.createManualSentRecall;
      const eventId = window.btoa(`recall-${newRecall.id}`);
      this.props.receiveEntities({
        entities: {
          patientTimelineEvents: {
            [eventId]: {
              id: eventId,
              type: 'recall',
              accountId: newRecall.accountId,
              patientId: newRecall.patientId,
              metaData: newRecall,
            },
          },
        },
      });

      this.props.showAlertTimeout({
        type: 'success',
        alert: {
          body: `${selectedRecall ? 'Updated logged' : 'Logged'} recall for ${
            activePatient.firstName
          }`,
        },
      });
      this.props.reset(getRecallsFormName(selectedRecall));
    } catch (err) {
      console.error('handleSentRecallFormSubmit Error:', err);
      this.props.showAlertTimeout({
        type: 'error',
        alert: {
          body:
            `Failed to ${selectedRecall ? 'update logged' : 'log'} ` +
            `recall for ${activePatient.firstName}`,
        },
      });
    }
  }

  render() {
    const {
      accountUsers,
      selectedNote,
      selectedFollowUp,
      selectedRecall,
      isNoteFormActive,
      isFollowUpsFormActive,
      isRecallsFormActive,
      activePatient,
    } = this.props;

    const isUpdatingNote = !!selectedNote;
    const isUpdatingFollowUp = !!selectedFollowUp;
    const isUpdatingRecall = !!selectedRecall;

    if (selectedRecall && selectedRecall.sentRecallOutcome) {
      selectedRecall.sentRecallOutcomeId = selectedRecall.sentRecallOutcome.id;
    }

    if (selectedFollowUp) {
      selectedFollowUp.isCompleted = !!selectedFollowUp.completedAt;
      selectedFollowUp.patientFollowUpTypeId = selectedFollowUp.patientFollowUpType.id;
    }

    return (
      <div className={styles.patientActionsContainer}>
        <FormModal
          isUpdate={isUpdatingNote}
          title={isUpdatingNote ? 'Edit Note' : 'Add Note'}
          formName={getNotesFormName(selectedNote)}
          active={isNoteFormActive || isUpdatingNote}
          onToggle={this.toggleForm(
            selectedNote,
            this.props.setSelectedNote,
            this.props.setIsNoteFormActive,
          )}
        >
          <CreateOrUpdatePatientNoteMutation isUpdate={isUpdatingNote}>
            {commit =>
              (isNoteFormActive || isUpdatingNote) && (
                <NotesForm
                  formName={getNotesFormName(selectedNote)}
                  initialValues={selectedNote}
                  onSubmit={values => this.handleNotesFormSubmit(values, commit)}
                  className={styles.notesForm}
                />
              )
            }
          </CreateOrUpdatePatientNoteMutation>
        </FormModal>
        <FormModal
          isUpdate={isUpdatingFollowUp}
          title={isUpdatingFollowUp ? 'Edit Follow-up' : 'Add Follow-up'}
          formName={getFollowUpsFormName(selectedFollowUp)}
          active={isFollowUpsFormActive || isUpdatingFollowUp}
          onToggle={this.toggleForm(
            selectedFollowUp,
            this.props.setSelectedFollowUp,
            this.props.setIsFollowUpsFormActive,
          )}
        >
          <CreateOrUpdateFollowUpMutation isUpdate={isUpdatingFollowUp}>
            {commit =>
              (isFollowUpsFormActive || isUpdatingFollowUp) && (
                <FollowUpsForm
                  accountUsers={accountUsers}
                  isUpdate={isUpdatingFollowUp}
                  formName={getFollowUpsFormName(selectedFollowUp)}
                  initialValues={selectedFollowUp}
                  onSubmit={values => this.handleFollowUpsFormSubmit(values, commit)}
                  className={styles.notesForm}
                />
              )
            }
          </CreateOrUpdateFollowUpMutation>
        </FormModal>
        <FormModal
          isUpdate={isUpdatingRecall}
          title={isUpdatingRecall ? 'Edit Logged Recall' : 'Log Recall'}
          formName={getRecallsFormName(selectedRecall)}
          active={isRecallsFormActive || isUpdatingRecall}
          onToggle={this.toggleForm(
            selectedRecall,
            this.props.setSelectedRecall,
            this.props.setIsRecallsFormActive,
          )}
        >
          <CreateOrUpdateSentRecallMutation isUpdate={isUpdatingRecall}>
            {commit =>
              (isRecallsFormActive || isUpdatingRecall) && (
                <LogRecallForm
                  patientId={activePatient.id}
                  isUpdate={isUpdatingRecall}
                  formName={getRecallsFormName(selectedRecall)}
                  initialValues={
                    selectedRecall || {
                      primaryType: 'phone',
                      note: '',
                      sentRecallOutcomeId: '',
                      createdAt: new Date().toISOString(),
                    }
                  }
                  onSubmit={values => this.handleSentRecallFormSubmit(values, commit)}
                  className={styles.notesForm}
                />
              )
            }
          </CreateOrUpdateSentRecallMutation>
        </FormModal>
      </div>
    );
  }
}

PatientActionsContainer.propTypes = {
  accountUsers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  userId: PropTypes.string,
  activePatient: PropTypes.instanceOf(PatientModel),
  activeAccount: PropTypes.instanceOf(AccountModel),
  receiveEntities: PropTypes.func.isRequired,
  showAlertTimeout: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  selectedNote: PropTypes.shape({
    id: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
  }),
  selectedFollowUp: PropTypes.shape({
    id: PropTypes.string.isRequired,
    note: PropTypes.string,
  }),
  selectedRecall: PropTypes.shape({
    id: PropTypes.string.isRequired,
    note: PropTypes.string,
  }),
  isNoteFormActive: PropTypes.bool,
  isFollowUpsFormActive: PropTypes.bool,
  isRecallsFormActive: PropTypes.bool,
  setSelectedNote: PropTypes.func.isRequired,
  setSelectedFollowUp: PropTypes.func.isRequired,
  setSelectedRecall: PropTypes.func.isRequired,
  setIsNoteFormActive: PropTypes.func.isRequired,
  setIsFollowUpsFormActive: PropTypes.func.isRequired,
  setIsRecallsFormActive: PropTypes.func.isRequired,
};

PatientActionsContainer.defaultProps = {
  userId: '',
  activePatient: null,
  activeAccount: null,
  selectedNote: null,
  selectedFollowUp: null,
  selectedRecall: null,
  isNoteFormActive: false,
  isFollowUpsFormActive: false,
  isRecallsFormActive: false,
};

function mapStateToProps({ entities, patientTable, auth }) {
  const waitForAuth = auth.get('accountId');
  const userId = auth.get('userId');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);
  const accountUsers = entities
    .getIn(['users', 'models'])
    .toArray()
    .filter(({ username }) => !username.includes('sync+'))
    .map(({ id, firstName, lastName }) => ({
      value: id,
      label: `${firstName} ${lastName}`,
    }));

  return {
    activeAccount,
    userId,
    accountUsers,
    activePatient: patientTable.get('activePatient'),
    selectedNote: patientTable.get('selectedNote'),
    selectedFollowUp: patientTable.get('selectedFollowUp'),
    selectedRecall: patientTable.get('selectedRecall'),
    isNoteFormActive: patientTable.get('isNoteFormActive'),
    isFollowUpsFormActive: patientTable.get('isFollowUpsFormActive'),
    isRecallsFormActive: patientTable.get('isRecallsFormActive'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      receiveEntities,
      showAlertTimeout,
      reset,
      setSelectedNote,
      setSelectedFollowUp,
      setSelectedRecall,
      setIsNoteFormActive,
      setIsFollowUpsFormActive,
      setIsRecallsFormActive,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(PatientActionsContainer);
