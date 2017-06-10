import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import styles from '../styles.scss';
import { Avatar } from '../../../library';

class UserInfo extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    const info = (this.props.currentPatient.anonPhone ? this.props.currentPatient.anonPhone : `${this.props.currentPatient.firstName}
      ${this.props.currentPatient.lastName},
      ${moment().diff(this.props.currentPatient.birthDate, 'years')}`);

    let showDate = null;

    if (moment(this.props.currentPatient.birthDate)._d.toString() !== 'Invalid Date' && !this.props.currentPatient.anonPhone) {
      showDate = moment(this.props.currentPatient.birthDate).format('MMMM Do YYYY');
    }

    const patientInfo = (!this.props.currentPatient.anonPhone ? (<div className={styles.contact}>
      <span><i className="fa fa-phone" style={{ color: '#ff715a' }} />&emsp; {this.props.currentPatient.mobilePhoneNumber}</span>
      <br />
      <span><i className="fa fa-flag" style={{ color: '#ff715a' }} />&emsp;{this.props.currentPatient.email}</span>
    </div>) : null);

    return (<div className={styles.patInfo}>
      <Avatar className={styles.infoAvatar} user={this.props.currentPatient} />
      <div className={styles.fullName}>{info}</div>
      <div className={styles.fonts}>{showDate}</div>
      <div className={styles.fonts}>{this.props.currentPatient.gender}</div>
      {patientInfo}
    </div>
    );
  }
}

UserInfo.propTypes = {
  currentPatient: PropTypes.object,
};

export default UserInfo;
