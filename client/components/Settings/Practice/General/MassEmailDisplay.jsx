
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header } from '../../../library';
import styles from './styles.scss';

class MassEmailDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailCount: 0,
    };
  }

  componentDidMount() {
    const { activeAccount } = this.props;

    this.props.getEmailBlastCount(activeAccount.id).then((resp) => {
      this.setState({
        emailCount: resp.data.patientEmailCount,
      });
    });
  }

  render() {
    const { massOnlineDate, openPreviewModal } = this.props;

    return (
      <div className={styles.formContainer}>
        <Header title="Online Booking Intro. Email Blast" contentHeader />
        {massOnlineDate && (
          <div className={styles.massOnlineEmail_date}>
            Last sent: {massOnlineDate}
          </div>
        )}
        {!massOnlineDate && (
          <div className={styles.massOnlineEmail_count}>
            This campaign will be sent to {this.state.emailCount} Patients.
          </div>
        )}
        <div className={styles.emailBlastButton}>
          <Button onClick={openPreviewModal}>Preview Email Template</Button>
        </div>
      </div>
    );
  }
}

MassEmailDisplay.propTypes = {
  activeAccount: PropTypes.objectOf(PropTypes.any),
  massOnlineDate: PropTypes.string,
  openPreviewModal: PropTypes.func,
  getEmailBlastCount: PropTypes.func,
};

export default MassEmailDisplay;
