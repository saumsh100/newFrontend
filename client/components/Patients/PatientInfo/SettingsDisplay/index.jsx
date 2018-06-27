
import React, { Component, PropTypes } from 'react';
import { Card, Modal, Tabs, Tab, Button, Icon } from '../../../library';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
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
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(values) {
    console.log(values);
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
          <div className={styles.text_edit} onClick={() => this.setModal()}>
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
                <Button
                  color="darkgrey"
                  onClick={() => this.reinitializeState()}
                >
                  Cancel
                </Button>
              </div>
              <RemoteSubmitButton
                {...remoteButtonProps}
                className={styles.remoteSubmit_button}
              >
                Save
              </RemoteSubmitButton>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default SettingsDisplay;
