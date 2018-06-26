
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import PatientProfile from './PatientProfile';
import { patientShape } from '../PropTypeShapes';

class PatientPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.setOpen = this.setOpen.bind(this);
    this.editPatient = this.editPatient.bind(this);
    this.closeOnScroll = this.closeOnScroll.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollId) {
      document
        .getElementById(this.props.scrollId)
        .addEventListener('scroll', this.closeOnScroll);
      window.addEventListener('scroll', this.closeOnScroll);
    }
  }

  setOpen(value) {
    this.setState({
      isOpen: value,
    });
  }

  editPatient(id) {
    this.props.push(`/patients/${id}`);
  }

  closeOnScroll() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const {
      placement, children, patient, closePopover,
    } = this.props;

    if (!patient) {
      return null;
    }

    return (
      <Popover
        className={styles.patientPopover}
        {...this.props}
        isOpen={this.state.isOpen && !closePopover}
        body={[
          <PatientProfile
            closePopover={() => this.setOpen(false)}
            patient={patient}
            isPatientUser={this.props.isPatientUser}
            editPatient={this.editPatient}
          />,
        ]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => this.setOpen(false)}
      >
        <div
          className={styles.patientLink}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      push,
    },
    dispatch,
  );
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
};

PatientPopover.defaultProps = {
  isPatientUser: false,
  closePopover: false,
  scrollId: '',
  placement: 'right',
  className: '',
};

const enhance = connect(
  null,
  mapDispatchToProps,
);
export default enhance(PatientPopover);
