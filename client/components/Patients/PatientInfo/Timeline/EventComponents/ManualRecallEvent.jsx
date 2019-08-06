
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dateFormatter } from '@carecru/isomorphic';
import EventContainer from './Shared/EventContainer';
import { showAlertTimeout } from '../../../../../thunks/alerts';
import { deleteEntity } from '../../../../../reducers/entities';
import { setSelectedRecall, setActivePatient } from '../../../../../reducers/patientTable';
import DeleteSentRecallMutation from '../../SentRecalls/DeleteSentRecallMutation';
import styles from './styles.scss';

const deleteConfirmation =
  'Are you sure you want to delete this logged recall? ' +
  'This change will not be reflected in the communication logs ' +
  'in your Practice Management Software.';

class ManualRecallEvent extends Component {
  constructor(props) {
    super(props);

    this.handleRecallEdit = this.handleRecallEdit.bind(this);
    this.handleRecallDelete = this.handleRecallDelete.bind(this);
  }

  handleRecallEdit(data) {
    this.props.setActivePatient(this.props.patient);
    this.props.setSelectedRecall(data);
  }

  async handleRecallDelete({ id }, commit) {
    try {
      if (!window.confirm(deleteConfirmation)) return;

      await commit({ variables: { id } });
      this.props.deleteEntity({
        key: 'patientTimelineEvents',
        id: window.btoa(`recall-${id}`),
      });

      this.props.showAlertTimeout({
        type: 'success',
        alert: { body: 'Deleted logged recall' },
      });
    } catch (err) {
      console.error('handleFollowUpDelete error:', err);
      this.props.showAlertTimeout({
        type: 'error',
        alert: { body: 'Failed to delete logged recall' },
      });
    }
  }

  render() {
    const { data } = this.props;
    const { id, note, primaryType, createdAt } = data;
    const sentDate = dateFormatter(createdAt, '', 'MMMM Do, YYYY h:mma');
    const headerComponent = (
      <div className={styles.recallHeader}>
        Logged a recall sent via {primaryType} on {sentDate}
      </div>
    );
    const subHeaderComponent = <div>{note && <div>Note: {note}</div>}</div>;

    return (
      <DeleteSentRecallMutation>
        {commit => (
          <EventContainer
            key={id}
            headerData={headerComponent}
            subHeaderData={subHeaderComponent}
            onEdit={() => this.handleRecallEdit(data)}
            onDelete={() => this.handleRecallDelete(data, commit)}
          />
        )}
      </DeleteSentRecallMutation>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteEntity,
      showAlertTimeout,
      setSelectedRecall,
      setActivePatient,
    },
    dispatch,
  );

const enhance = connect(
  null,
  mapDispatchToProps,
);

ManualRecallEvent.propTypes = {
  data: PropTypes.shape({
    createdAt: PropTypes.string,
    isAutomated: PropTypes.bool,
    primaryType: PropTypes.string,
  }).isRequired,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
  deleteEntity: PropTypes.func.isRequired,
  showAlertTimeout: PropTypes.func.isRequired,
  setSelectedRecall: PropTypes.func.isRequired,
  setActivePatient: PropTypes.func.isRequired,
};

export default enhance(ManualRecallEvent);
