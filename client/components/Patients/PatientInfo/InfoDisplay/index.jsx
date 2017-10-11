
import React, { Component, PropTypes } from 'react';
import { Card, Modal, Tabs, Tab } from '../../../library';
import PersonalForm from './PersonalForm';
import AppointmentsForm from './AppointmentsForm/index';
import styles from './styles.scss';


class InfoDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      tabIndex: 0,
    };

    this.setModal = this.setModal.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  setModal() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  reinitializeState() {
    this.setState({
      isOpen: false,
    });
  }

  handleTabChange(index) {
    this.setState({ tabIndex: index });
  }

  render() {
    const {
      patient,
    } = this.props;

    return (
      <Card>
        <div onClick={() => this.setModal()}>
          Edit
        </div>
        <Modal
          active={this.state.isOpen}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          custom
        >
          <div className={styles.editModal}>
            <div className={styles.header}>{`Editing ${patient.get('firstName')}'s Patient Info`}</div>
            <div className={styles.content}>
              <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} noUnderLine >
                <Tab label="Appointments" >
                  <AppointmentsForm
                    patient={patient}
                  />
                </Tab>
                <Tab label="Personal"  >
                  <PersonalForm
                    patient={patient}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </Modal>
      </Card>
    );
  }
}

export default InfoDisplay;
