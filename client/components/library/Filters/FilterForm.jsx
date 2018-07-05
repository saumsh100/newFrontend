
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '../../library';
import FilterField from './FilterField';
import styles from './styles.scss';
import FormSection from '../Form/FormSection';

function FilterForm(props) {
  const {
    filters, handleSubmit, formName, flipped, initialValues,
  } = props;
  return (
    <Form form={formName} onChange={handleSubmit} ignoreSaveButton initialValues={initialValues}>
      {filters.map((f) => {
        const content = f.items.map(item => (
          <FilterField key={`filterField_${item.value}`} item={item} flipped={flipped} />
        ));
        return (
          <FormSection name={f.title} key={`filterForm_${f.title}`}>
            <div>
              <div className={styles.filters__title}>
                {f.titleIcon && (
                  <div
                    style={{ backgroundColor: f.titleIcon.color }}
                    className={styles.filters__title__icon}
                  >
                    <span className={`fa fa-${f.titleIcon.icon}`} />
                  </div>
                )}
                {f.title}
              </div>
              <div className={styles.filters__checkFilter}>{content}</div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
}

FilterForm.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    title: PropTypes.string,
  })).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  flipped: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    ratings: PropTypes.objectOf(PropTypes.bool),
    sources: PropTypes.objectOf(PropTypes.bool),
  }).isRequired,
};

export default FilterForm;
