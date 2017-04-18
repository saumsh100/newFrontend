
import React, { Component, PropTypes } from 'react';
import { Form, Field } from '../../library';
import FilterField from './FilterField';
import styles from './styles.scss';

export default function FilterForm(props) {
  const {
    filters,
    handleSubmit,
    formName,
  } = props;

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      ignoreSaveButton
    >
      {filters.map((f) => {
        const content =
          f.items.map((item) => {
            return <FilterField item={item} />;
          });

        return (
          <div>
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
