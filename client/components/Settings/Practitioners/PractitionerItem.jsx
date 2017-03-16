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
    const { fullname } = this.props;
    return(
      <ListItem onClick={this.showItem} className={styles.practListItem}>
        {fullname}
      </ListItem>
    );
  }
}

export default PractitionerItem;