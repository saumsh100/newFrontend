import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox } from '../../../../library';

class FilterChairs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allChairs: true,
    };
    this.handleChairCheck = this.handleChairCheck.bind(this);
    this.handleAllCheck = this.handleAllCheck.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
  }

  handleChairCheck(checked, chair) {
    if (checked) {
      this.props.removeScheduleFilter({ key: 'chairsFilter', id: chair.get('id') })
      this.isAllChecked(-1);
    } else {
      this.props.addScheduleFilter({ key: 'chairsFilter', entity: chair });
      this.isAllChecked(+1);
    }
  }

  isAllChecked(addOrRemove) {
    const {
      selectedFilterChairs,
      chairs,
    } = this.props;

    if((selectedFilterChairs.length + addOrRemove) === chairs.length) {
      this.setState({ allChairs: true });
    } else {
      this.setState({ allChairs: false });
    }
  }

  handleAllCheck() {
    if (this.state.allChairs) {
      this.props.clearScheduleFilter({ key: 'chairsFilter' });
    } else {
      this.props.addAllScheduleFilter({ key: 'chairsFilter', entities: this.props.chairs });
    }

    this.setState({ allChairs: !this.state.allChairs });
  }

  render() {
    const {
      selectedFilterChairs,
      chairs,
    } = this.props;

    const {
      allChairs,
    } = this.state;

    const chairsIds = selectedFilterChairs.map(chair => chair.id);

    return (
      <div className={styles.filter_options__item}>
        <div className={styles.filter_options__title}>Chairs:</div>
        <Checkbox
          label={'All'}
          checked={allChairs}
          onChange={this.handleAllCheck}
        />
        {chairs.map((c) => {
          const checked = chairsIds.indexOf(c.get('id')) > -1;

          return (
            <Checkbox
              key={c.get('id')}
              label={c.get('name')}
              checked={checked}
              onChange={() => this.handleChairCheck(checked, c)}
            />
          );
        })}
      </div>
    );
  }
}

FilterChairs.PropTypes = {

};

export default FilterChairs;
