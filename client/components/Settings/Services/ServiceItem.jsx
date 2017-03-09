import React, { PropTypes, Component } from 'react';
import { ListItem } from '../../library';

class ServiceItem extends Component {
  constructor(props) {
    super(props);
    this.showItem = this.showItem.bind(this);
  }

  showItem() {
    this.props.setServiceId({ id: this.props.id });
  }

  render() {
    const { service } = this.props;
    return(
      <ListItem onClick={this.showItem}>
        {service}
      </ListItem>
    );
  }
}

export default ServiceItem;