import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from '../styles.scss';
import { Checkbox } from '../../../../library';
import {
  addScheduleFilter,
  removeScheduleFilter,
  clearScheduleFilter,
  addAllScheduleFilter,
} from '../../../../../actions/schedule';

class FilterServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allChecked: true,
    };
    this.handleEntityCheck = this.handleEntityCheck.bind(this);
    this.handleAllCheck = this.handleAllCheck.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
  }

  handleEntityCheck(checked, entity) {
    const { filterKey }  = this.props
    if (checked) {
      this.props.removeScheduleFilter({ key: filterKey , id: entity.get('id') })
      this.isAllChecked(-1);
    } else {
      this.props.addScheduleFilter({ key: filterKey , entity: entity });
      this.isAllChecked(1);
    }
  }

  isAllChecked(addOrRemove) {
    const {
      selectedFilterItem,
      entities,
    } = this.props;

    if ((selectedFilterItem.length + addOrRemove) === entities.length) {
        this.setState({ allChecked : true });
    } else {
      this.setState({ allChecked: false })
    }

  }

  handleAllCheck() {
    const { filterKey, entities }  = this.props

    if (this.state.allChecked) {
      this.props.clearScheduleFilter({ key: filterKey });
    } else {
      this.props.addAllScheduleFilter({ key: filterKey , entities })
    }

    this.setState({ allChecked: !this.state.allChecked });
  }

  render() {
    const {
      selectedFilterItem,
      entities,
      label,
    } = this.props;

    const {
      allChecked,
    } = this.state;

    const filterIds = selectedFilterItem.map(item => item.id);

    return (
      <div className={styles.filter_options__item}>
        <div className={styles.filter_options__title}>{label}</div>
        <Checkbox
          label={'All'}
          checked={allChecked}
          onChange={this.handleAllCheck}
        />
        {entities.map((entity) => {
          const checked = filterIds.indexOf(entity.get('id')) > -1;

          return (
            <Checkbox
              key={entity.get('id')}
              label={entity.get('name')}
              checked={checked}
              onChange={() => this.handleEntityCheck(checked, entity)}
            />
          );
        })}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addScheduleFilter,
    removeScheduleFilter,
    clearScheduleFilter,
    addAllScheduleFilter,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

FilterServices.PropTypes = {
  services: PropTypes.Object,
  selectedFilterServices: PropTypes.arrayOf(Object),
};

export default enhance(FilterServices);
