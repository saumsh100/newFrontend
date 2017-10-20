import React, { Component, PropTypes } from 'react';
import { Button, DialogBox } from '../../../library';
import NewPatientForm from '../NewPatientForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import styles from '../styles.scss';


class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.setActive = this.setActive.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setActive() {
    this.setState({
      active: true,
    });
  }
  reinitializeState() {
    this.setState({
      active: false,
    });
  }

  handleSubmit(values) {
    const {
      createEntityRequest,
    } = this.props;

    values.isSyncedWithPms = false;

    const alert = {
      success: {
        body: 'New Patient Added.',
      },
      error: {
        body: 'Failed to add patient.',
      },
    };

    createEntityRequest({
      key: 'patients',
      entityData: values,
      alert,
    }).then(() => {
      this.reinitializeState();
    });
  }

  render() {
    const {
      totalPatients,
    } = this.props;

    const formName = 'newUser';

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.handleSubmit, component: RemoteSubmitButton, props: { form: formName }},
    ];

    return (
      <div className={styles.header}>
        <div className={styles.header_title}> All Patients </div>
        <div className={styles.header_subHeader}>
          Showing {totalPatients} Patients
        </div>
        <Button
          className={styles.addNewButton}
          onClick={() => this.setActive()}
        >
          Add New Patient
        </Button>
        <DialogBox
          actions={actions}
          title="Add New Patient"
          type="medium"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <NewPatientForm
            onSubmit={this.handleSubmit}
            formName={formName}
          />
        </DialogBox>
      </div>
    );
  }
}

export default HeaderComponent;
