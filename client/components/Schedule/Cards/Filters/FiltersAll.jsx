
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  addScheduleFilter,
  removeScheduleFilter,
  clearScheduleFilter,
  addAllScheduleFilter,
} from '../../../../actions/schedule';

import FilterPractitioners from './FilterPractitioners';
import FilterCheckbox from './FilterCheckbox';

class FiltersAll extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.allFiltersCheck;

    this.handleEntityCheck = this.handleEntityCheck.bind(this);
    this.handleAllCheck = this.handleAllCheck.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
  }

  handleEntityCheck(checked, id, filterKey ) {
    const temp = {}
    if (checked) {
      this.props.removeScheduleFilter({ key: filterKey , id })
      temp[filterKey] = false;
      this.setState(temp);
    } else {
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
    let sumFilter = selectedFilters[filterKey].length ;
    let lenEntities = entities[filterKey].length;

    if (lenEntities > 2) {
      if (sumFilter + 1 === entities[filterKey].length ) {
        this.setState(temp);
      }
    } else if (sumFilter === lenEntities - 1 ) {
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

    const {
      selectedFilters,
      entities,
    } = this.props;

    return (
      <div>
        <FilterPractitioners
          filterKey="practitionersFilter"
          allChecked={this.state['practitionersFilter']}
          practitioners={entities.practitionersFilter}
          selectedFilterItem={selectedFilters.practitionersFilter}
          handleAllCheck={this.handleAllCheck}
          handleEntityCheck={this.handleEntityCheck}
        />
        <div style={{display: 'flex'}}>
          <FilterCheckbox
            label="Services"
            filterKey="servicesFilter"
            allChecked={this.state['servicesFilter']}
            entities={entities.servicesFilter}
            selectedFilterItem={selectedFilters.servicesFilter}
            handleAllCheck={this.handleAllCheck}
            handleEntityCheck={this.handleEntityCheck}
          />
          <FilterCheckbox
            label="Chairs"
            filterKey="chairsFilter"
            allChecked={this.state['chairsFilter']}
            entities={entities.chairsFilter}
            selectedFilterItem={selectedFilters.chairsFilter}
            handleAllCheck={this.handleAllCheck}
            handleEntityCheck={this.handleEntityCheck}
          />
        </div>
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

FiltersAll.PropTypes = {
  services: PropTypes.Object,
  selectedFilterServices: PropTypes.arrayOf(Object),
};

export default enhance(FiltersAll);
