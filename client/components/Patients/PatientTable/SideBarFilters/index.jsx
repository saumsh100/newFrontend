
import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import Demographics from './Demographics';
import styles from './styles.scss';

class SideBarFilters extends Component {
  constructor(props){
    super(props);
    this.handleDemographics = this.handleDemographics.bind(this)
  }

  handleDemographics(values) {
    this.props.addFilter({
      type: 'Demographics',
      subType: '',
      values,
      index: 0,
    });
  }

  render() {
    return (
      <div className={styles.sideBar}>
        <div className={styles.header}>
          <div className={styles.header_icon}> <Icon icon="sliders" /> </div>
          <div className={styles.header_text}> Filters </div>
        </div>
        <div className={styles.filtersContainer}>
          <div className={styles.filterHeader}>
            Demographics
            <span className={styles.filterHeader_icon}> <Icon icon="caret-down" /> </span>
          </div>
          <div className={styles.collapsible}>
            <Demographics
              handleDemographics={this.handleDemographics}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SideBarFilters;
