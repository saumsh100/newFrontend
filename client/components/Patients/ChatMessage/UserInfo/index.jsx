import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import styles from '../styles.scss';
import { Avatar } from '../../../library';

class UserInfo extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    const age = moment().diff(this.props.currentPatient.birthDate, 'years');
    const name = `${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName}`;

    let showDate = null;

    if (moment(this.props.currentPatient.birthDate)._d.toString() !== "Invalid Date") {
      showDate = moment(this.props.currentPatient.birthDate).format('MMMM Do YYYY')
    }

    return (<div className={styles.patInfo}>
        <Avatar className={styles.infoAvatar} user={this.props.currentPatient} />
        <div className={styles.fullName}>{name}, {age}</div>
        <div className={styles.fonts}>{showDate}</div>
        <div className={styles.fonts}>{this.props.currentPatient.gender}</div>
        <div className={styles.contact}>
          <span><i className="fa fa-phone" style={{ color: '#ff715a' }} />&emsp; {this.props.currentPatient.phoneNumber}</span>
          <br />
          <span><i className="fa fa-flag" style={{ color: '#ff715a' }} />&emsp;{this.props.currentPatient.email}</span>
        </div>
      </div>
    );
  }
}

UserInfo.propTypes = {
  currentPatient: PropTypes.object,
};

export default UserInfo;
