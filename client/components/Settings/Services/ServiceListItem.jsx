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
    const { service, serviceId, id } = this.props;

    const selectItem = serviceId === id;

    return(
      <ListItem
        onClick={this.showItem}
        className={styles.servicesListItem}
        selectItem={selectItem}
        data-test-id={service}
      >
        <div className={styles.servicesListItem_text}>
         {service}
        </div>
      </ListItem>
    );
  }
}

ServiceListItem.propTypes = {
  setServiceId: PropTypes.func,
  service: PropTypes.string,
};


export default ServiceListItem;
