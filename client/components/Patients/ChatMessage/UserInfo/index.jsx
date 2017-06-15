import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as Actions from '../../../../actions/patientList';
import styles from '../styles.scss';
import { Avatar } from '../../../library';

class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.handlePatientClick = this.handlePatientClick.bind(this);
  }

  handlePatientClick(id) {
    const {
      setSelectedPatientId,
    } = this.props;

    console.log(id)

    setSelectedPatientId(id);
    this.props.push('/patients/list');
  }

  render() {

    const info = (this.props.currentPatient.anonPhone ? <div className={styles.fullName2}>{this.props.currentPatient.anonPhone}</div>
      : (<div onClick={this.handlePatientClick.bind(null, this.props.currentPatient.id)} className={styles.fullName}> {`${this.props.currentPatient.firstName}
      ${this.props.currentPatient.lastName}, ${moment().diff(this.props.currentPatient.birthDate, 'years')}`} </div>));

    const clickable = (this.props.currentPatient.anonPhone ? this.handlePatientClick.bind(null, this.props.currentPatient.id) : () => null);

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
      {info}
      <div className={styles.fonts}>{showDate}</div>
      <div className={styles.fonts}>{this.props.currentPatient.gender}</div>
      {patientInfo}
    </div>
    );
  }
}

UserInfo.propTypes = {
  currentPatient: PropTypes.object,
  setSelectedPatientId: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    push,
    setSelectedPatientId: Actions.setSelectedPatientIdAction,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(UserInfo);
