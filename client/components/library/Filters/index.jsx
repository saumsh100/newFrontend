import React, { Component, PropTypes } from 'react';
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
    console.log(values);
  }

  render() {
    const { filters } = this.props;
    return (
      <Card borderColor={colorMap.red} className={styles.card}>
        <div className={styles.filters}>
          <div className={styles.filters__header}>
            <div className={styles.filters__header__left}>
              <span>Filters</span>
              <span className="fa fa-sliders" />
            </div>
            <div className={styles.filters__header__right}>
              <span>Select All</span>
              <span>Clear All</span>
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
          />
        </div>
      </Card>
    );
  }
}

Filters.propTypes = {
  filters: PropTypes.arrayOf(Object),
};

export default Filters;
