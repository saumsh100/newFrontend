
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import EventContainer from './Shared/EventContainer';
import { showAlertTimeout } from '../../../../../thunks/alerts';
import { deleteEntity } from '../../../../../reducers/entities';
import { setSelectedFollowUp, setActivePatient } from '../../../../../reducers/patientTable';
import UserModel from '../../../../../entities/models/User';
import DeletePatientFollowUpMutation from '../../FollowUps/DeletePatientFollowUpMutation';
import styles from './styles.scss';

class FollowUpEvent extends Component {
  constructor(props) {
    super(props);

    this.handleFollowUpEdit = this.handleFollowUpEdit.bind(this);
    this.handleFollowUpDelete = this.handleFollowUpDelete.bind(this);
  }

  handleFollowUpEdit(data) {
    this.props.setActivePatient(this.props.patient);
    this.props.setSelectedFollowUp(data);
  }

  async handleFollowUpDelete({ id }, commit) {
    try {
      if (!window.confirm('Are you sure you want to delete this follow-up?')) return;

      await commit({ variables: { id } });
      this.props.deleteEntity({
        key: 'patientTimelineEvents',
        id: window.btoa(`followUp-${id}`),
      });

      this.props.showAlertTimeout({
        type: 'success',
        alert: { body: 'Deleted follow-up' },
      });
    } catch (err) {
      console.error('handleFollowUpDelete error:', err);
      this.props.showAlertTimeout({
        type: 'error',
        alert: { body: 'Failed to delete follow-up' },
      });
    }
  }

  render() {
    const { data, assignedUser } = this.props;
    const {
      note,
      dueAt,
      completedAt,
      patientFollowUpType: { name },
    } = data;

    const headerComponent = (
      <div className={styles.followUpHeaderWrapper}>
        {`${name} on ${moment(dueAt).format('MMMM Do, YYYY')}`}
      </div>
    );

    const subHeaderComponent = (
      <div>
        <div>Status: {completedAt ? 'Completed' : 'Not Completed'}</div>
        <div>
          Assigned to:{' '}
          {assignedUser ? `${assignedUser.firstName || ''} ${assignedUser.lastName || ''}` : 'n/a'}
        </div>
        {note && <div>Note: {note}</div>}
      </div>
    );

    return (
      <DeletePatientFollowUpMutation>
        {commit => (
          <EventContainer
            key={data.id}
            headerData={headerComponent}
            subHeaderData={subHeaderComponent}
            onEdit={() => this.handleFollowUpEdit(data)}
            onDelete={() => this.handleFollowUpDelete(data, commit)}
          />
        )}
      </DeletePatientFollowUpMutation>
    );
  }
}

function mapStateToProps({ entities }, { data }) {
  const { assignedUserId } = data;
  const assignedUser = entities
    .getIn(['users', 'models'])
    .toArray()
    .find(({ id }) => id === assignedUserId);

  return {
    assignedUser,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteEntity,
      showAlertTimeout,
      setSelectedFollowUp,
      setActivePatient,
    },
    dispatch,
  );

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

FollowUpEvent.propTypes = {
  assignedUser: PropTypes.instanceOf(UserModel).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    note: PropTypes.string,
    dueAt: PropTypes.string,
    completedAt: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
  deleteEntity: PropTypes.func.isRequired,
  showAlertTimeout: PropTypes.func.isRequired,
  setSelectedFollowUp: PropTypes.func.isRequired,
  setActivePatient: PropTypes.func.isRequired,
};

export default enhance(FollowUpEvent);
