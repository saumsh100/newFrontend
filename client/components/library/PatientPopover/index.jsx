
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import PatientProfile from './PatientProfile';

class PatientPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.setOpen = this.setOpen.bind(this);
    this.editPatient = this.editPatient.bind(this)
  }

  setOpen(value) {
    this.setState({
      isOpen: value,
    });
  }

  editPatient(id) {
    this.props.push(`/patients/${id}`);
  }

  render() {
    const {
      placement,
      children,
      className,
      patient,
      closePopover,
    } = this.props;

    return (
      <Popover
        className={styles.patientPopover}
        {...this.props}
        isOpen={this.state.isOpen && !closePopover}
        body={[(
          <PatientProfile
            closePopover={() => this.setOpen(false)}
            patient={patient}
            isPatientUser={this.props.isPatientUser}
            editPatient={this.editPatient}
          />
        )]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => this.setOpen(false)}
      >
        <div className={styles.patientLink}>
          {React.Children.map(children, (patientLink) => {
            return (
              React.cloneElement(patientLink, {
                onClick: () => this.setOpen(true),
              })
            );
          })}
        </div>
      </Popover>
    );
  }
}

PatientPopover.propTypes = {
  children: PropTypes.element,
  patient: PropTypes.object,
  className: PropTypes.object,
  placement: PropTypes.string,
  isPatientUser: PropTypes.bool,
  closePopover: PropTypes.bool,
  push: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    push,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);
export default enhance(PatientPopover);
