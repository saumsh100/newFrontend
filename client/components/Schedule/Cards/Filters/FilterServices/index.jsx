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

  componentWillMount() {
    const {
      services
    } = this.props;

    //this.props.addAllScheduleFilter({ key: 'servicesFilter', entities: services })
  }

  handleServiceCheck(checked, service) {
    if (checked) {
      this.props.removeScheduleFilter({ key: 'servicesFilter', id: service.get('id') })
      this.setState({ allServices: false });
    } else {
      this.props.addScheduleFilter({ key: 'servicesFilter', entity: service });
      this.isAllChecked();
    }
  }

  isAllChecked() {
    const {
      selectedFilterServices,
      services,
    } = this.props;

    if(selectedFilterServices.length + 1 === services.length) {
      this.setState({ allServices: true });
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
