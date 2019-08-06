
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EventContainer from './Shared/EventContainer';
import { showAlertTimeout } from '../../../../../thunks/alerts';
import { deleteEntity } from '../../../../../reducers/entities';
import { setSelectedNote, setActivePatient } from '../../../../../reducers/patientTable';
import DeletePatientNoteMutation from '../../Notes/DeletePatientNoteMutation';
import styles from './styles.scss';

class NoteEvent extends Component {
  constructor(props) {
    super(props);

    this.handleNoteEdit = this.handleNoteEdit.bind(this);
    this.handleNoteDelete = this.handleNoteDelete.bind(this);
  }

  handleNoteEdit(data) {
    this.props.setActivePatient(this.props.patient);
    this.props.setSelectedNote(data);
  }

  async handleNoteDelete({ id }, commit) {
    try {
      if (!window.confirm('Are you sure you want to delete this note?')) return;

      await commit({ variables: { id } });
      this.props.deleteEntity({
        key: 'patientTimelineEvents',
        id: window.btoa(`note-${id}`),
      });

      this.props.showAlertTimeout({
        type: 'success',
        alert: { body: 'Deleted note' },
      });
    } catch (err) {
      console.error('handleNoteDelete error:', err);
      this.props.showAlertTimeout({
        type: 'error',
        alert: { body: 'Failed to delete note' },
      });
    }
  }

  render() {
    const { data } = this.props;
    const headerComponent = <div className={styles.noteHeaderWrapper}>{data.note}</div>;

    return (
      <DeletePatientNoteMutation>
        {commit => (
          <EventContainer
            key={data.id}
            headerData={headerComponent}
            onEdit={() => this.handleNoteEdit(data)}
            onDelete={() => this.handleNoteDelete(data, commit)}
          />
        )}
      </DeletePatientNoteMutation>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteEntity,
      showAlertTimeout,
      setSelectedNote,
      setActivePatient,
    },
    dispatch,
  );

const enhance = connect(
  null,
  mapDispatchToProps,
);

NoteEvent.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    note: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
  deleteEntity: PropTypes.func.isRequired,
  showAlertTimeout: PropTypes.func.isRequired,
  setSelectedNote: PropTypes.func.isRequired,
  setActivePatient: PropTypes.func.isRequired,
};

export default enhance(NoteEvent);
