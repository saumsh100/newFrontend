import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { CheckboxImage } from '../../../../library';

class FilterPractitioners extends Component{

  componentWillMount() {

  }

  render() {

    const {
      practitioners,
      handleCheckDoctor,
      selectedFilterPractitioners,
    } = this.props;

    return (
      <div>
        <div className={styles.filter_practitioner__title}>
          Practitioner
        </div>
        <ul className={styles.filter_practitioner__wrapper}>
          {practitioners.map((pr, i) => {
            const checked = selectedFilterPractitioners.indexOf(pr.id) > -1;
            const label = (<div className={styles.filter_practitioner__name}>{pr.firstName}</div>);
            return (
              <div key={pr.id} className={styles.filter_practitioner__list}>
                <CheckboxImage
                  key={pr.id}
                  checked={checked}
                  onChange={() => { handleCheckDoctor(pr.id, checked); }}
                  id={`checkbox-${i}`}
                  label={label}
                />
              </div>
            );
          })}
        </ul>
      </div>
    );
  }


}

FilterPractitioners.PropTypes = {

};

export default FilterPractitioners;
