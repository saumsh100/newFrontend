
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

import {
  setAllFilters
} from '../../../../thunks/schedule'

class FiltersAll extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.allFiltersCheck;

    this.handleEntityCheck = this.handleEntityCheck.bind(this);
    this.handleAllCheck = this.handleAllCheck.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
  }

  handleEntityCheck(checked, id, filterKey) {
    const temp = {}
    if (checked) {
      this.props.removeScheduleFilter({ key: filterKey , id })
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
    const lenFilter = selectedFilters[filterKey].length ;
    const lenEntities = entities[filterKey].length;

    if (lenEntities > 2) {
      if (lenFilter + 1 === entities[filterKey].length) {
        this.setState(temp);
      }
    } else if (lenFilter === lenEntities - 1) {
        this.setState(temp);
    }
  }

  handleAllCheck(filterKey) {
    const {
      entities,
      clearScheduleFilter,
      addAllScheduleFilter,
    } = this.props;

    if (this.state[filterKey]) {
      clearScheduleFilter({ key: filterKey });
    } else {
      addAllScheduleFilter({ key: filterKey, entities: entities[filterKey] });
    }

    const temp = {};
    temp[filterKey] = !this.state[filterKey];
    this.setState(temp);
  }

  handleClearAll() {
    const objArr = Object.keys(this.state);

    objArr.map((filterKey) => {
      this.props.clearScheduleFilter({ key: filterKey });
      const temp = {};
      temp[filterKey] = false;
      this.setState(temp);
    });
  }

  handleSelectAll() {
    const {
      entities,
      addAllScheduleFilter,
      setAllFilters,
    } = this.props;

    const objArr = Object.keys(this.state);
    setAllFilters(['services']);

    objArr.map((filterKey) => {
      addAllScheduleFilter({ key: filterKey, entities: entities[filterKey] });
      const temp = {};
      temp[filterKey] = true;
      this.setState(temp);
    });
  }

  render() {
    return (
      <FiltersDisplay
        {...this.props}
        allChecked={this.state}
        handleAllCheck={this.handleAllCheck}
        handleEntityCheck={this.handleEntityCheck}
        handleClearAll={this.handleClearAll}
        handleSelectAll={this.handleSelectAll}
      />
    );
  }
}

FiltersAll.propTypes = {
  selectedFilterServices: PropTypes.arrayOf(Object),
  clearScheduleFilter: PropTypes.func,
  addAllScheduleFilter: PropTypes.func,
  removeScheduleFilter: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addScheduleFilter,
    removeScheduleFilter,
    clearScheduleFilter,
    addAllScheduleFilter,
    setAllFilters,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(FiltersAll);
