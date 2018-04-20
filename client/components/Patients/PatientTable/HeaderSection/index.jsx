
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DialogBox, Input, DropdownMenu, Icon } from '../../../library';
import NewPatientForm from './NewPatientForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import SmartFilters from './SmartFilters';
import Actions from './Actions';
import styles from '../styles.scss';

class HeaderSection extends Component {
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
      this.props.destroy('newUser')
      this.reinitializeState();
    });
  }

  render() {
    const {
      totalPatients,
      smartFilter,
      setSmartFilter,
      patientIds,
    } = this.props;

    const formName = 'newPatientForm';

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { border: 'blue' } },
      { label: 'Save', onClick: this.handleSubmit, component: RemoteSubmitButton, props: { color: 'blue', form: formName }},
    ];

    const filterMenu = props => (
      <div
        {...props}
        className={styles.filterMenuButton}
      >
        <div
          className={styles.header_title}
        >
          {smartFilter ? smartFilter.label : 'All Patients' }
          <div className={styles.header_icon}>
            <Icon icon="caret-down" type="solid" size={1.7} />
          </div>
        </div>
      </div>
    );

    const actionsMenu = props => (
      <div {...props} className={styles.buttonContainer_actions}>
        <Button
          iconRight="caret-down"
          border="blue"
        >
          Actions
        </Button>
      </div>
    );

    return (
      <div className={styles.header} >
        <div>
          <DropdownMenu
            data-test-id="dropDown_smartFilters"
            labelComponent={filterMenu}
            data-test-id="dropDown_smartFilters"
          >
            <div className={styles.filterContainer}>
              <SmartFilters
                setSmartFilter={setSmartFilter}
                smartFilter={smartFilter}
              />
            </div>
          </DropdownMenu>
          <div className={styles.header_subHeader} data-test-id={'text_totalPatientsCount'}>
            {`Showing ${totalPatients} Patients`}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <DropdownMenu
            labelComponent={actionsMenu}
            className={styles.alignDD}
          >
            <Actions
              patientIds={patientIds}
            />
          </DropdownMenu>
          <Button
            onClick={() => this.setActive()}
            compact
            color="blue"
            data-test-id="button_addNewPatient"
          >
            Add New Patient
          </Button>
        </div>

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

HeaderSection.propTypes = {
  totalPatients: PropTypes.number,
  smartFilter: PropTypes.object,
  setSmartFilter: PropTypes.func.isRequired,
  patientIds: PropTypes.arrayOf(String),
  createEntityRequest: PropTypes.func.isRequired,
};

export default HeaderSection;
