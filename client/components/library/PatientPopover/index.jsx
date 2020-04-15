
import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import PatientProfile from './PatientProfile';
import { patientShape } from '../PropTypeShapes';
import styles from './styles.scss';
import { getOrCreateChatForPatient } from '../../../thunks/chat';

class PatientPopover extends Component {
  static generatePatientUrl(id) {
    return `/patients/${id}`;
  }

  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.setOpen = this.setOpen.bind(this);
    this.editPatient = this.editPatient.bind(this);
    this.closeOnScroll = this.closeOnScroll.bind(this);
    this.handleGoToChat = this.handleGoToChat.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollId) {
      document.getElementById(this.props.scrollId).addEventListener('scroll', this.closeOnScroll);
      window.addEventListener('scroll', this.closeOnScroll);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.patientChat === null && prevProps.patientChat !== this.props.patientChat) {
      this.props.push(`/chat/${this.props.patientChat}`);
    }
  }

  setOpen(value) {
    this.setState({ isOpen: value });
  }

  editPatient(id) {
    this.props.push(`/patients/${id}`);
  }

  closeOnScroll() {
    this.setState({ isOpen: false });
  }

  handleGoToChat(patientId) {
    return () => {
      this.props.getOrCreateChatForPatient(patientId);
    };
  }

  render() {
    const {
      placement,
      children,
      patient,
      closePopover,
      patientStyles,
      isNoteFormActive,
      isFollowUpsFormActive,
      isRecallsFormActive,
    } = this.props;
    const isAnyFormActive = isNoteFormActive || isFollowUpsFormActive || isRecallsFormActive;
    if (!patient) {
      return null;
    }

    return (
      <Popover
        {...this.props}
        isOpen={this.state.isOpen && !closePopover}
        body={[
          <PatientProfile
            closePopover={() => this.setOpen(false)}
            patient={patient}
            handleGoToChat={this.handleGoToChat(patient.id)}
            patientUrl={PatientPopover.generatePatientUrl(patient.id)}
            isPatientUser={this.props.isPatientUser}
            editPatient={this.editPatient}
          />,
        ]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => !isAnyFormActive && this.setOpen(false)}
      >
        <div
          className={classnames(styles.patientLink, patientStyles)}
          onDoubleClick={() => this.editPatient(patient.id)}
        >
          {React.Children.map(children, patientLink =>
            React.cloneElement(patientLink, {
              onClick: (e) => {
                e.stopPropagation();
                this.setOpen(true);
              },
            }))}
        </div>
      </Popover>
    );
  }
}

PatientPopover.propTypes = {
  children: PropTypes.element.isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  className: PropTypes.string,
  placement: PropTypes.string,
  isPatientUser: PropTypes.bool,
  closePopover: PropTypes.bool,
  push: PropTypes.func.isRequired,
  scrollId: PropTypes.string,
  patientStyles: PropTypes.string,
  getOrCreateChatForPatient: PropTypes.func.isRequired,
  patientChat: PropTypes.string,
  isNoteFormActive: PropTypes.bool.isRequired,
  isFollowUpsFormActive: PropTypes.bool.isRequired,
  isRecallsFormActive: PropTypes.bool.isRequired,
};

PatientPopover.defaultProps = {
  isPatientUser: false,
  closePopover: false,
  scrollId: '',
  placement: 'right',
  className: styles.patientPopover,
  patientStyles: styles.patientPopoverTitle,
  patientChat: null,
};

const mapStateToProps = ({ patientTable }) => ({
  isNoteFormActive: patientTable.get('isNoteFormActive'),
  isFollowUpsFormActive: patientTable.get('isFollowUpsFormActive'),
  isRecallsFormActive: patientTable.get('isRecallsFormActive'),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      push,
      getOrCreateChatForPatient,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientPopover);
