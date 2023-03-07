import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withState } from 'recompose';
import { Card, StandardButton as Button } from '..';
import FilterForm from './FilterForm';
import styles from './styles.scss';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  handleSubmit(values) {
    const { setReputationFilter, filterKey } = this.props;

    if (filterKey === 'listingsFilter') {
      const filterSources = [];
      if (values && values['Source Type']) {
        const v = values['Source Type'];
        Object.keys(v).forEach((k) => {
          if (v[k] === false) {
            delete values[k];
          } else {
            filterSources.push(k);
          }
        });
      }
      const filterStatuses = [];
      if (values && values['Listing Status']) {
        const v = values['Listing Status'];
        Object.keys(v).forEach((k) => {
          if (v[k] === false) {
            delete values[k];
          } else {
            filterStatuses.push(k);
          }
        });
      }

      const filterData = {
        sourceTypes: filterSources,
        listingStatuses: filterStatuses,
      };
      setReputationFilter({ key: filterKey, filterData });
    }

    if (filterKey === 'reviewsFilter') {
      const filterSources = [];
      if (values && values.sources) {
        const v = values.sources;
        Object.keys(v).forEach((k) => {
          if (v[k] === false) {
            delete values[k];
          } else {
            filterSources.push(k);
          }
        });
      }
      const filterRatings = [];
      if (values && values.ratings) {
        const v = values.ratings;
        Object.keys(v).forEach((k) => {
          if (v[k] === false) {
            delete values[k];
          } else {
            filterRatings.push(k[0]);
          }
        });
      }
      const filterData = {
        sources: filterSources,
        ratings: filterRatings,
      };

      setReputationFilter({ key: filterKey, filterData });
    }
  }

  clearAll() {
    const { change, filterKey, initialValues } = this.props;

    const firstKey = Object.keys(initialValues)[0];
    const firstKeys = Object.keys(initialValues[firstKey]);
    const secondKey = Object.keys(initialValues)[1];
    const secondKeys = Object.keys(initialValues[secondKey]);

    firstKeys.map((fk) => {
      change(filterKey, `${firstKey}.${fk}`, false);
    });

    secondKeys.map((sk) => {
      change(filterKey, `${secondKey}.${sk}`, false);
    });
  }

  render() {
    const { filters, selectAll, initialValues, reset, filterKey } = this.props;

    return (
      <Card className={styles.card}>
        <div className={styles.filters}>
          <div className={styles.filters__header}>
            <div className={styles.filters__header__left}>
              <span className="fal fa-filter" />
              <span>Filters</span>
            </div>
            <div className={styles.filters__header__right}>
              <Button variant="flat" onClick={() => reset(filterKey)}>
                Select All
              </Button>
              <Button variant="flat" onClick={() => this.clearAll()}>
                Clear All
              </Button>
            </div>
          </div>
          <FilterForm
            filters={filters}
            formName={filterKey}
            handleSubmit={this.handleSubmit}
            flipped={selectAll}
            initialValues={initialValues}
          />
        </div>
      </Card>
    );
  }
}

Filters.propTypes = {
  filters: PropTypes.arrayOf(Object).isRequired,
  filterKey: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  reset: PropTypes.func.isRequired,
  selectAll: PropTypes.bool.isRequired,
};

const enhance = withState('selectAll', 'setAll', false);

export default enhance(Filters);
