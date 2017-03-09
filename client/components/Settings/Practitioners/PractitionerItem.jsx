import React, { PropTypes, Component } from 'react';
import { ListItem } from '../../library';

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
      <ListItem onClick={this.showItem}>
        {fullname}
      </ListItem>
    );
  }
}

export default PractitionerItem;