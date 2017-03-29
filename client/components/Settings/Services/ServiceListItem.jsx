import React, { PropTypes, Component } from 'react';
import { ListItem } from '../../library';
import styles from './styles.scss';

class ServiceListItem extends Component {
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
      <ListItem onClick={this.showItem}  className={styles.servicesListItem}>
        {service}
      </ListItem>
    );
  }
}

ServiceListItem.propTypes = {
  setServiceId: PropTypes.func,
  service: PropTypes.string,
};


export default ServiceListItem;
