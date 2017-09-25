
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

  handleSubmit(values) {
    const {
      setReputationFilter,
      key
    } = this.props;

    setReputationFilter({ key, filterData: values });
  }

  render() {
    const { filters, selectAll, setAll, reviewsFilter } = this.props;

    return (
      <Card  className={styles.card}>
        <div className={styles.filters}>
          <div className={styles.filters__header}>
            <div className={styles.filters__header__left}>
              <span>Filters</span>
              <span className="fa fa-sliders" />
            </div>
            <div className={styles.filters__header__right}>
              <span onClick={()=>setAll(true)}>Select All</span>
              <span onClick={()=>setAll(false)}>Clear All</span>
            </div>
          </div>
          <div className={styles.filters__search}>
            <span className="fa fa-search" />
            <input type="text" placeholder="Search..." />
          </div>
          <FilterForm
            filters={filters}
            formName="filtersList"
            handleSubmit={this.handleSubmit}
            flipped={selectAll}
          />
        </div>
      </Card>
    );
  }
}

Filters.propTypes = {
  filters: PropTypes.arrayOf(Object),
};

const enhance = withState('selectAll', 'setAll', false)

export default enhance(Filters);
