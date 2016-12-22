import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Button, Modal, ModalHeader, ModalBody,
  ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { updatePatient, postPatient } from '../../thunks/fetchPatients';
import { closeForm } from '../../actions/patientForm';

class AddPatientForm extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      patient: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
      },
    };
    this.setNewPatient = this.setNewPatient.bind(this);
    this.patientAction = this.patientAction.bind(this);
  }

  setNewPatient(e) {
    const patient = this.state.patient;
    patient[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ patient });
    console.log(patient);
  }

  patientAction() {
    const patientToEdit = this.props.patient;
    console.log(patientToEdit);
    const patient = this.state.patient;
    if (!patientToEdit) {
      this.props.postPatient(patient);
      this.props.closeForm();
      return;
    }
    const updatedPatient = patientToEdit.merge({
      firstName: patient.firstName || patientToEdit.firstName,
      lastName: patient.lastName || patientToEdit.lastName,
      phoneNumber: patient.phoneNumber || patientToEdit.phoneNumber,
    });

    this.props.updatePatient(updatedPatient);
    this.props.closeForm();
    console.log(updatedPatient);
  }

  render() {
    console.log(this.props);
    const patientToEdit = this.props.patient;
    return (
      <div>
        <Modal isOpen={this.props.opened} toggle={this.props.closeForm}>
          <ModalHeader toggle={this.props.closeForm}>
            {patientToEdit ? 'Edit the patient' : 'Please enter the patient info'}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="firstName">First name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  onChange={this.setNewPatient}
                  placeholder="John"
                  defaultValue={patientToEdit ? patientToEdit.firstName : ''}
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  onChange={this.setNewPatient}
                  placeholder="Baker"
                  defaultValue={patientToEdit ? patientToEdit.lastName : ''}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone number</Label>
                <Input
                  type="text"
                  name="phoneNumber"
                  id="phone"
                  onChange={this.setNewPatient}
                  placeholder="+17782422626"
                  defaultValue={patientToEdit ? patientToEdit.phoneNumber : ''}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.patientAction}>{patientToEdit ? 'Edit patient' : 'Add patient'}</Button>{' '}
            <Button color="secondary" onClick={this.props.closeForm}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    opened: state.patientForm.opened,
    patient: state.patientForm.patient,
  };
}

AddPatientForm.propTypes = {
  closeForm: PropTypes.func,
  patient: PropTypes.instanceOf(Immutable.Map),
  postPatient: PropTypes.func,
  updatePatient: PropTypes.func,
  opened: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    postPatient,
    closeForm,
    updatePatient,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddPatientForm);
