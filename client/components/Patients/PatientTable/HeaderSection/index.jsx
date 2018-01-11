
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

    const formName = 'newUser';

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.handleSubmit, component: RemoteSubmitButton, props: { form: formName }},
    ];

    const filterMenu = props => (
      <div{...props} className={styles.filterMenuButton}>
        <div className={styles.header_title}>
          {smartFilter ? smartFilter.label : 'All Patients' }
          <div className={styles.header_icon}>
            <Icon icon="caret-down" type="solid" />
          </div>
        </div>
      </div>
    );

    const actionsMenu = props => (
      <div {...props} className={styles.buttonContainer_actions}>
        <Button
          color="blue"
          iconRight="caret-down"
        >
          Actions
        </Button>
      </div>
    );

    return (
      <div className={styles.header}>
        <div style={{ display: 'flex' }}>
        <div>
          <DropdownMenu
            labelComponent={filterMenu}
          >
            <div className={styles.filterContainer}>
              <SmartFilters
                setSmartFilter={setSmartFilter}
                smartFilter={smartFilter}
              />
            </div>
          </DropdownMenu>
          <div className={styles.header_subHeader}>
            {`Showing ${totalPatients} Patients`}
          </div>
        </div>
        </div>
        <div className={styles.buttonContainer}>
          <DropdownMenu
            labelComponent={actionsMenu}
          >
            <Actions
              patientIds={patientIds}
            />
          </DropdownMenu>
          <Button
            onClick={() => this.setActive()}
            border="blue"
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