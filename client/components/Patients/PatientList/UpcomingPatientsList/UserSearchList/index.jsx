import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from '../../main.scss';

class UserSearchList extends Component {
  constructor(props) {
    super(props);
    this.goToDialogue = this.goToDialogue.bind(this);
  }

  goToDialogue() {
    this.props.setSearchPatient();
  }

  render() {
    const { user } = this.props;

    const age = moment().diff(user.birthDate, 'years');

    return (
      <div onMouseDown={this.goToDialogue} className={styles.users}>
        <img className={styles.users__photo} src="https://placeimg.com/80/80/animals" alt="photo" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles.users__name}>
              {user.firstName} {user.lastName}, {age}
            </div>

          </div>
        </div>
      </div>
    );
  }
}
UserSearchList.propTypes = {
  user: PropTypes.object.isRequired,
  currentPatient: PropTypes.object,
};

export default UserSearchList;
