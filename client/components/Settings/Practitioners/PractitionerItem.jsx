import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, PractitionerAvatar } from '../../library';
import styles from './styles.scss';

class PractitionerItem extends Component {
  constructor(props) {
    super(props);
    this.showItem = this.showItem.bind(this);
  }

  showItem() {
    this.props.setPractitionerId({ id: this.props.id });
  }

  render() {
    const { fullName, id, practitionerId, practitioner } = this.props;

    const selectedPractitioner = practitionerId === id;

    return (
      <ListItem
        onClick={this.showItem}
        className={classNames(styles.practListItem, {
          [styles.selected]: selectedPractitioner,
        })}
        selectItem={selectedPractitioner}
        data-test-id={this.props['data-test-id']}
      >
        <div className={styles.practListItem_container}>
          <span className={styles.practListItem_avatarContainer}>
            <PractitionerAvatar
              className={styles.practitionerItemAvatar}
              practitioner={practitioner.toJS()}
              size="md"
            />
          </span>
          <div className={styles.practListItem_textContainer}>
            <div
              className={classNames(styles.practListItem_name, {
                [styles.practListItem_name_selected]: selectedPractitioner,
              })}
            >
              {fullName}
            </div>
            <div className={styles.practListItem_type}>{practitioner.get('type') || 'Dentist'}</div>
          </div>
        </div>
      </ListItem>
    );
  }
}

PractitionerItem.defaultProps = {
  'data-test-id': '',
};

PractitionerItem.propTypes = {
  setPractitionerId: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  practitionerId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  practitioner: PropTypes.shape({
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    toJS: PropTypes.func,
    get: PropTypes.func,
  }).isRequired,
  'data-test-id': PropTypes.string,
};

export default PractitionerItem;
