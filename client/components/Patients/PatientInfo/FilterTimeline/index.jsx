
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SContainer, SHeader, SFooter, SBody, Icon } from '../../../library';
import SingleEvent from './SingleEvent';
import styles from './styles.scss';

class FilterTimeline extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      defaultEvents,
      addRemoveFilter,
      filters,
      clearFilters,
      selectAllFilters,
    } = this.props;

    return (
      <SContainer className={styles.filterContainer}>
        <SHeader className={styles.header}>
          <Icon icon="filter" className={styles.filterIcon} />
          Filter Timeline
          <div className={styles.headerOptions}>
            <div className={styles.selectText} onClick={selectAllFilters}>
              Select All
            </div>
            <div className={styles.clearText} onClick={clearFilters}>
              Clear All
            </div>
          </div>
        </SHeader>
        <SBody className={styles.body}>
          <div className={styles.subHeader}>Events</div>
          <div className={styles.eventWrapper}>
            {defaultEvents.map((event, index) => {
              const checked = filters.indexOf(event) > -1;

              return (
                <SingleEvent
                  key={`SingleEvent_${index}`}
                  type={event}
                  checked={checked}
                  onClick={(e) => {
                    e.stopPropagation();
                    addRemoveFilter(event);
                  }}
                />
              );
            })}
          </div>
        </SBody>
      </SContainer>
    );
  }
}

FilterTimeline.propTypes = {
  defaultEvents: PropTypes.instanceOf(Array),
  addRemoveFilter: PropTypes.func.isRequired,
  filters: PropTypes.instanceOf(Array),
};

export default FilterTimeline;
