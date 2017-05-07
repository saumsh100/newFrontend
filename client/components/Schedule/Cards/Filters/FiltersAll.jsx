
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FiltersDisplay from './FiltersDisplay';

import {
  addScheduleFilter,
  removeScheduleFilter,
  clearScheduleFilter,
  addAllScheduleFilter,
} from '../../../../actions/schedule';

class FiltersAll extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.allFiltersCheck;

    this.handleEntityCheck = this.handleEntityCheck.bind(this);
    this.handleAllCheck = this.handleAllCheck.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
  }

  handleEntityCheck(checked, id, filterKey, hideCheck ) {
    const temp = {}
    if (checked && hideCheck) {
      this.props.removeScheduleFilter({ key: filterKey , id })
      temp[filterKey] = false;
      this.setState(temp);
    } else if (checked && !hideCheck) {
      this.props.clearScheduleFilter({ key: filterKey });
      this.props.addScheduleFilter({ key: filterKey , id });
      temp[filterKey] = false;
      this.setState(temp);
    } else  {
      this.props.addScheduleFilter({ key: filterKey , id });
      this.isAllChecked(filterKey);
    }
  }

  isAllChecked(filterKey) {
    const {
      selectedFilters,
      entities,
    } = this.props;

    const temp = {};
    temp[filterKey] = true;
    let lenFilter = selectedFilters[filterKey].length ;
    let lenEntities = entities[filterKey].length;

    if (lenEntities > 2) {
      if (lenFilter + 1 === entities[filterKey].length ) {
        this.setState(temp);
      }
    } else if (lenFilter === lenEntities - 1 ) {
        this.setState(temp);
    }
  }

  handleAllCheck(filterKey) {
    const { entities }  = this.props

    if (this.state[filterKey]) {
      this.props.clearScheduleFilter({ key: filterKey });
    } else {
      this.props.addAllScheduleFilter({ key: filterKey, entities: entities[filterKey] });
    }
    const temp = {};
    temp[filterKey] = !this.state[filterKey];
    this.setState(temp);
  }

  render() {
    return (
      <FiltersDisplay
        {...this.props}
        allChecked={this.state}
        handleAllCheck={this.handleAllCheck}
        handleEntityCheck={this.handleEntityCheck}
      />
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

FiltersAll.PropTypes = {
  services: PropTypes.Object,
  selectedFilterServices: PropTypes.arrayOf(Object),
};

export default enhance(FiltersAll);
