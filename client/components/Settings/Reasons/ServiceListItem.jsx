
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const {
      service, serviceId, id, duration,
    } = this.props;

    const selectItem = serviceId === id;

    return (
      <ListItem
        onClick={this.showItem}
        className={styles.servicesListItem}
        selectItem={selectItem}
        data-test-id={service}
      >
        <div>
          <div className={styles.servicesListItem_text}>{service}</div>
          <div className={styles.servicesListItem_duration}>
            Duration:{' '}
            <span className={styles.servicesListItem_duration_text}>
              {duration} min
            </span>
          </div>
        </div>
      </ListItem>
    );
  }
}

ServiceListItem.propTypes = {
  setServiceId: PropTypes.func,
  service: PropTypes.string,
  serviceId: PropTypes.string,
  duration: PropTypes.number,
};

export default ServiceListItem;
