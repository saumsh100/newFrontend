
import React, { Component, PropTypes } from 'react';
import { withState } from 'recompose';
import { Card, Checkbox, Search, Form } from '../../library';
import FilterForm from './FilterForm';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      change,
      filterKey,
    } = this.props;



  }

  handleSubmit(values) {
    const {
      setReputationFilter,
      filterKey,
    } = this.props;

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
      const filterSources = []
      if (values && values.sources) {
        const v = values.sources
        Object.keys(v).forEach((k) => {
          if (v[k] === false) {
            delete values[k];
          } else {
            filterSources.push(k);
          }
        });
      }
      const filterRatings = []
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

  render() {
    const { filters, selectAll, setAll, initialValues, reset, filterKey} = this.props;

    return (
      <Card className={styles.card}>
        <div className={styles.filters}>
          <div className={styles.filters__header}>
            <div className={styles.filters__header__left}>
              <span>Filters</span>
              <span className="fa fa-sliders" />
            </div>
            <div className={styles.filters__header__right}>
              <span onClick={()=> reset(filterKey)}>Clear All</span>
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
  filters: PropTypes.arrayOf(Object),
};

const enhance = withState('selectAll', 'setAll', false);

export default enhance(Filters);
