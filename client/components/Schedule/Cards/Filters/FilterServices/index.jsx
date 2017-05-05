import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox } from '../../../../library';

class FilterServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allServices: true,
    };
    this.handleServiceCheck = this.handleServiceCheck.bind(this);
    this.handleAllCheck = this.handleAllCheck.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
  }

  handleServiceCheck(checked, service) {
    if (checked) {
      this.props.removeScheduleFilter({ key: 'servicesFilter', id: service.get('id') })
      this.isAllChecked(-1);
    } else {
      this.props.addScheduleFilter({ key: 'servicesFilter', entity: service });
      this.isAllChecked(1);
    }
  }

  isAllChecked(addOrRemove) {
    const {
      selectedFilterServices,
      services,
    } = this.props;

    if ((selectedFilterServices.length + addOrRemove) === services.length) {
        this.setState({ allServices : true });
    } else {
      this.setState({ allServices: false })
    }

  }

  handleAllCheck() {
    if (this.state.allServices) {
      this.props.clearScheduleFilter({ key: 'servicesFilter' });
    } else {
      this.props.addAllScheduleFilter({ key: 'servicesFilter', entities: this.props.services })
    }

    this.setState({ allServices: !this.state.allServices });
  }

  render() {
    const {
      selectedFilterServices,
      services,
    } = this.props;

    const {
      allServices,
    } = this.state;

    const serviceIds = selectedFilterServices.map(service => service.id);

    console.log(serviceIds);
    return (
      <div className={styles.filter_options__item}>
        <div className={styles.filter_options__title}>Services:</div>
        <Checkbox
          label={'All'}
          checked={allServices}
          onChange={this.handleAllCheck}
        />
        {services.map((s) => {
          const checked = serviceIds.indexOf(s.get('id')) > -1;

          return (
            <Checkbox
              key={s.get('id')}
              label={s.get('name')}
              checked={checked}
              onChange={() => this.handleServiceCheck(checked, s)}
            />
          );
        })}
      </div>
    );
  }
}

FilterServices.PropTypes = {
  services: PropTypes.Object,
  selectedFilterServices: PropTypes.arrayOf(Object),
};

export default FilterServices;
