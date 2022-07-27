import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { SContainer, SHeader, SBody, Icon } from '../../../library';
import SingleEvent from './SingleEvent';
import styles from './styles.scss';

export default function FilterTimeline({
  defaultEvents,
  addRemoveFilter,
  filters,
  clearFilters,
  selectAllFilters,
}) {
  return (
    <SContainer className={styles.filterContainer}>
      <SHeader className={styles.header}>
        <Icon icon="filter" className={styles.filterIcon} />
        Filters
        <div className={styles.headerOptions}>
          <div
            className={styles.selectText}
            onClick={selectAllFilters}
            role="button"
            tabIndex={0}
            onKeyUp={(e) => e.keyCode === 13 && selectAllFilters}
          >
            Select All
          </div>
          <div
            className={styles.clearText}
            onClick={clearFilters}
            role="button"
            tabIndex={0}
            onKeyUp={(e) => e.keyCode === 13 && clearFilters}
          >
            Clear All
          </div>
        </div>
      </SHeader>
      <SBody className={styles.body}>
        <div className={styles.subHeader}>Events</div>
        <div className={styles.eventWrapper}>
          {defaultEvents.map((event) => {
            const checked = filters.toJS().indexOf(event) > -1;
            return (
              <SingleEvent
                key={`SingleEvent_${event}`}
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

FilterTimeline.propTypes = {
  defaultEvents: PropTypes.instanceOf(Array),
  addRemoveFilter: PropTypes.func.isRequired,
  filters: PropTypes.instanceOf(List),
  clearFilters: PropTypes.func.isRequired,
  selectAllFilters: PropTypes.func.isRequired,
};

FilterTimeline.defaultProps = {
  defaultEvents: null,
  filters: List,
};
