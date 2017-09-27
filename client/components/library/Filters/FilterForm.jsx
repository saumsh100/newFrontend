
import React, { Component, PropTypes } from 'react';
import { Form, Field } from '../../library';
import { connect } from 'react-redux';
import FilterField from './FilterField';
import styles from './styles.scss';
import FormSection from '../Form/FormSection';

function FilterForm(props) {
  const {
    filters,
    handleSubmit,
    formName,
    flipped,
    initialValues,
  } = props;

  return (
    <Form
      form={formName}
      onChange={handleSubmit}
      ignoreSaveButton
      initialValues={initialValues}
    >
      {filters.map((f, i) => {
        const content =
          f.items.map((item, index) => {
            return <FilterField key={`filterField_${index}`} item={item} flipped={flipped} />;
          });

        return (
          <FormSection name={f.title}>
            <div key={`filterForm_${i}`}>
              <div className={styles.filters__title}>
                {f.titleIcon &&
                <div
                  style={{ backgroundColor: f.titleIcon.color }}
                  className={styles.filters__title__icon}
                >
                  <span className={`fa fa-${f.titleIcon.icon}`} />
                </div>
                }
                {f.title}
              </div>
              <div className={styles.filters__checkFilter}>
                {content}
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
}

FilterForm.propTypes = {
  filters: PropTypes.arrayOf(Object),
  handleSubmit: PropTypes.func,
  formName: PropTypes.string,
};

export default FilterForm;
