
import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import { patientShape } from '../PropTypeShapes';
import { getOrCreateChatForPatient } from '../../../thunks/chat';
import styles from './styles.scss';
import PatientUserProfile from './PatientUserProfile';

class PatientUserPopover extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.setOpen = this.setOpen.bind(this);
    this.closeOnScroll = this.closeOnScroll.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollId) {
      document.getElementById(this.props.scrollId).addEventListener('scroll', this.closeOnScroll);
      window.addEventListener('scroll', this.closeOnScroll);
    }
  }

  setOpen(value) {
    this.setState({ isOpen: value });
  }

  closeOnScroll() {
    this.setState({ isOpen: false });
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
          <PatientUserProfile
            isPatientUser
            closePopover={() => this.setOpen(false)}
            patient={patient}
          />,
        ]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => !isAnyFormActive && this.setOpen(false)}
      >
        <div className={classnames(styles.patientLink, patientStyles)}>
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

PatientUserPopover.propTypes = {
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

PatientUserPopover.defaultProps = {
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
)(PatientUserPopover);
