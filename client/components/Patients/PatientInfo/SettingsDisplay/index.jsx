
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Tabs, Tab, Button, Icon } from '../../../library';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import { patientShape } from '../../../library/PropTypeShapes';
import styles from './styles.scss';

class SettingsDisplay extends Component {
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

  onKeyDown(e, callback) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      callback();
    }
  }

  setModal() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
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
    const { patient } = this.props;

    const remoteButtonProps = {
      onClick: this.reinitializeState,
      form: `Form${this.state.tabIndex + 1}`,
    };

    return (
      <div className={styles.mainContainer}>
        <div className={styles.text}>
          <div
            className={styles.text_edit}
            onClick={() => this.setModal()}
            onKeyDown={e => this.onKeyDown(e, this.setModal)}
            tabIndex={0}
            role="button"
          >
            <Icon icon="cog" className={styles.text_icon} />
            Settings
          </div>
        </div>
        <Modal
          active={this.state.isOpen}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          custom
        >
          <div className={styles.editModal}>
            <div className={styles.header}>
              {`Editing ${patient.get('firstName')}'s Settings`}
              <div
                className={styles.header_closeIcon}
                onClick={this.reinitializeState}
                role="button"
                onKeyDown={e => this.onKeyDown(e, this.reinitializeState)}
                tabIndex={0}
              >
                <Icon icon="times" />
              </div>
            </div>
            <div className={styles.content}>
              <Tabs index={this.state.tabIndex} onChange={this.handleTabChange}>
                <Tab label="Reminders">
                  <div>test</div>
                </Tab>
              </Tabs>
            </div>
            <div className={styles.remoteSubmit}>
              <div className={styles.remoteSubmit_buttonDelete}>
                <Button color="darkgrey" onClick={this.reinitializeState}>
                  Cancel
                </Button>
              </div>
              <RemoteSubmitButton {...remoteButtonProps}>Save</RemoteSubmitButton>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

SettingsDisplay.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
};

export default SettingsDisplay;
