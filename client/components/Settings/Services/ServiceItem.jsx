import React, { PropTypes, Component } from 'react';
import { ListItem } from '../../library';

class ServiceItem extends Component {

  constructor(props) {
    super(props);
    this.showItem = this.showItem.bind(this);
  }

  showItem() {
    this.props.showService(this.props.index);
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