import React, { PropTypes, Component } from 'react';
import { ListItem } from '../../library';
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
    const { fullName, id, practitionerId } = this.props;

    const selectedPractitioner = practitionerId === id;

    return(
      <ListItem
        onClick={this.showItem}
        className={styles.practListItem}
        selectItem={selectedPractitioner}
        data-test-id={this.props['data-test-id']}
      >
        {fullName}
      </ListItem>
    );
  }
}


PractitionerItem.propTypes = {
  setPractitionerId: PropTypes.func,
  fullName: PropTypes.string,
};

export default PractitionerItem;
